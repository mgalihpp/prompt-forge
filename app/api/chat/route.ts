import { auth } from "@clerk/nextjs/server";
import type { Prisma } from "@prisma/client";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateObject,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { chatModel } from "@/lib/ai";
import {
  bestLabel,
  DeepForgeReviewSchema,
  type ForgeReviewData,
  type ForgeUIMessage,
  type ForgeVariantData,
  isDeepForgeMessage,
  reviewPart,
  VARIANT_ANGLES,
  VARIANT_LABELS,
  type VariantLabel,
  variantParts,
  verdictScore,
} from "@/lib/deep-forge";
import {
  critiqueSystemPrompt,
  critiqueUserPrompt,
  systemPrompt,
  variantSystemPrompt,
} from "@/lib/forge-prompt";
import { prisma } from "@/lib/prisma";
import { checkUsage, LIMIT_MESSAGE, trySpendPrompt } from "@/lib/usage";

export const maxDuration = 60;

type Body = {
  messages: UIMessage[];
  opts?: Record<string, string>;
  deepForge?: boolean;
  threadId?: string; // set by the composer after history.createThread
  mode?: "send" | "regenerate";
};

const HISTORY_CAP = 100;

function textOf(message: UIMessage | undefined): string {
  return (
    message?.parts
      ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("") ?? ""
  );
}

/**
 * Deep-forge assistant turns arrive as data-part-only messages, which
 * `convertToModelMessages` ignores. Replace each with a single text part
 * carrying its best-scored variant so multi-turn REFINEMENT stays coherent.
 */
function canonicalize(messages: UIMessage[]): UIMessage[] {
  return messages.map((m) => {
    if (m.role !== "assistant" || !isDeepForgeMessage(m)) return m;
    const review = reviewPart(m);
    const variants = variantParts(m);
    const best =
      review?.status === "done"
        ? variants.find((v) => v.label === bestLabel(review))
        : variants[0];
    return { ...m, parts: [{ type: "text", text: best?.text ?? "" }] };
  });
}

/** Save the completed exchange and trim the owner to the newest 100 threads. */
async function persistExchange(
  userId: string,
  threadId: string,
  userText: string,
  assistantText: string,
  assistantParts?: Prisma.InputJsonValue,
) {
  // Ownership guard: never write into someone else's thread.
  const owned = await prisma.chatThread.findFirst({
    where: { id: threadId, clerkId: userId },
    select: { id: true },
  });
  if (!owned) return;

  await prisma.$transaction([
    prisma.chatMessage.createMany({
      data: [
        { threadId, clerkId: userId, role: "user", text: userText },
        {
          threadId,
          clerkId: userId,
          role: "assistant",
          text: assistantText,
          ...(assistantParts ? { parts: assistantParts } : {}),
        },
      ],
    }),
    prisma.chatThread.update({
      where: { id: threadId },
      data: { updatedAt: new Date() },
    }),
  ]);

  const excess = await prisma.chatThread.findMany({
    where: { clerkId: userId },
    orderBy: { updatedAt: "desc" },
    skip: HISTORY_CAP,
    select: { id: true },
  });
  if (excess.length) {
    await prisma.chatThread.deleteMany({
      where: { id: { in: excess.map((t) => t.id) } }, // cascade removes messages
    });
  }
}

/**
 * On regenerate, drop every persisted message beyond the ones the client
 * still holds (minus the pending user turn), so persistExchange re-appends
 * a clean pair instead of piling up stale rows. Handles both last-exchange
 * regenerate and mid-thread edits (edit truncates the client array first).
 */
async function truncateThread(
  userId: string,
  threadId: string,
  keepCount: number,
) {
  const stale = await prisma.chatMessage.findMany({
    where: { threadId, clerkId: userId },
    orderBy: { createdAt: "asc" },
    skip: keepCount,
    select: { id: true },
  });
  if (stale.length) {
    await prisma.chatMessage.deleteMany({
      where: { id: { in: stale.map((m) => m.id) } },
    });
  }
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  if (!(await checkUsage(userId))) {
    return new Response(LIMIT_MESSAGE, { status: 429 });
  }

  const { messages, opts, deepForge, threadId, mode }: Body = await req.json();

  const modelMessages = await convertToModelMessages(canonicalize(messages));
  const userText = textOf(messages.at(-1));


  // Standard heat: one streamed forge. Fast path, streaming UX preserved.
  if (!deepForge) {
    const result = streamText({
      model: chatModel,
      system: systemPrompt(opts, false),
      messages: modelMessages,
      onFinish: async ({ text }) => {
        if (!text) return;
        if (mode === "regenerate" && threadId) {
          await truncateThread(userId, threadId, messages.length - 1);
        }
        await Promise.all([
          trySpendPrompt(userId).catch(() => {}),
          threadId
            ? persistExchange(userId, threadId, userText, text).catch(() => {})
            : Promise.resolve(),
        ]);
      },
    });
    return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream }),
    });
  }

  // Deep Forge: three variants forged in parallel from distinct angles,
  // then one comparative critic pass (critiques + scores + follow-ups).
  // Still one quota spend for the whole request.
  const stream = createUIMessageStream<ForgeUIMessage>({
    async execute({ writer }) {
      const variants = Object.fromEntries(
        VARIANT_LABELS.map((label) => [
          label,
          {
            label,
            angle: VARIANT_ANGLES[label].name,
            text: "",
            status: "streaming",
          } satisfies ForgeVariantData,
        ]),
      ) as Record<VariantLabel, ForgeVariantData>;

      const writeVariant = (label: VariantLabel) =>
        writer.write({
          type: "data-forge-variant",
          id: label,
          data: { ...variants[label] },
        });

      // Skeleton first so the tabs render immediately.
      for (const label of VARIANT_LABELS) writeVariant(label);
      writer.write({
        type: "data-forge-review",
        id: "review",
        data: { status: "judging" },
      });

      // Three parallel streams; each rewrites its own data part (throttled —
      // the client reconciles by id, replacing the part's data wholesale).
      await Promise.all(
        VARIANT_LABELS.map(async (label) => {
          try {
            const result = streamText({
              model: chatModel,
              system: variantSystemPrompt(opts, label),
              messages: modelMessages,
              maxOutputTokens: 1600,
            });
            let last = 0;
            for await (const delta of result.textStream) {
              variants[label].text += delta;
              const now = Date.now();
              if (now - last > 120) {
                last = now;
                writeVariant(label);
              }
            }
            variants[label].status = "done";
          } catch {
            variants[label].status = "error";
          }
          writeVariant(label); // final flush — never lose the last delta
        }),
      );

      // Single comparative critic over all three variants.
      let review: ForgeReviewData;
      try {
        const { object } = await generateObject({
          model: chatModel,
          schema: DeepForgeReviewSchema,
          system: critiqueSystemPrompt(),
          prompt: critiqueUserPrompt(userText, Object.values(variants)),
          maxOutputTokens: 1600,
        });
        review = {
          status: "done",
          verdicts: Object.fromEntries(
            VARIANT_LABELS.map((label) => [
              label,
              { ...object[label], score: verdictScore(object[label]) },
            ]),
          ) as Extract<ForgeReviewData, { status: "done" }>["verdicts"],
          followUps: object.followUps,
        };
      } catch {
        review = { status: "error" };
      }
      writer.write({ type: "data-forge-review", id: "review", data: review });

      // One spend per deep forge; persistence is best-effort.
      const bestText =
        review.status === "done"
          ? variants[bestLabel(review)].text
          : (Object.values(variants).find((v) => v.text)?.text ?? "");
      if (!bestText) return;
      const persistedParts = [
        ...Object.values(variants).map((v) => ({
          type: "data-forge-variant",
          id: v.label,
          data: v,
        })),
        { type: "data-forge-review", id: "review", data: review },
      ] as Prisma.InputJsonValue;
      if (mode === "regenerate" && threadId) {
        await truncateThread(userId, threadId, messages.length - 1);
      }
      await Promise.all([
        trySpendPrompt(userId).catch(() => {}),
        threadId
          ? persistExchange(
              userId,
              threadId,
              userText,
              bestText,
              persistedParts,
            ).catch(() => {})
          : Promise.resolve(),
      ]);
    },
    onError: (e) => (e instanceof Error ? e.message : "Deep Forge failed"),
  });

  return createUIMessageStreamResponse({ stream });
}

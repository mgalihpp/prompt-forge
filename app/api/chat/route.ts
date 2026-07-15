import { auth } from "@clerk/nextjs/server";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  generateText,
  type ModelMessage,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { chatModel } from "@/lib/ai";
import { reflectSystemPrompt, systemPrompt } from "@/lib/forge-prompt";
import { prisma } from "@/lib/prisma";

export const maxDuration = 60;

type Body = {
  messages: UIMessage[];
  opts?: Record<string, string>;
  deepForge?: boolean;
  threadId?: string; // set by the composer after history.createThread
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

/** Save the completed exchange and trim the owner to the newest 100 threads. */
async function persistExchange(
  userId: string,
  threadId: string,
  userText: string,
  assistantText: string,
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
        { threadId, clerkId: userId, role: "assistant", text: assistantText },
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

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { messages, opts, deepForge, threadId }: Body = await req.json();

  const system = systemPrompt(opts, deepForge);
  const modelMessages = await convertToModelMessages(messages);
  const userText = textOf(messages.at(-1));

  const onFinish = ({ text }: { text: string }) => {
    if (!threadId || !text) return;
    return persistExchange(userId, threadId, userText, text).catch(() => {
      // Persistence is best-effort; never break the stream over it.
    });
  };

  // Standard heat: one streamed forge. Fast path, streaming UX preserved.
  if (!deepForge) {
    const result = streamText({
      model: chatModel,
      system,
      messages: modelMessages,
      onFinish,
    });
    return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream }),
    });
  }

  // Deep Forge: draft silently, then run ONE reflection pass and stream that.
  // Only the final, improved blade reaches the user, so the surface is identical
  // — and only the final blade is persisted.
  const draft = await generateText({
    model: chatModel,
    system,
    messages: modelMessages,
  });

  const reflectionMessages: ModelMessage[] = [
    ...modelMessages,
    { role: "assistant", content: draft.text },
    {
      role: "user",
      content:
        "That draft is your forged prompt. Run the reflection pass and return only the improved prompt.",
    },
  ];

  const result = streamText({
    model: chatModel,
    system: reflectSystemPrompt(system),
    messages: reflectionMessages,
    onFinish,
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}

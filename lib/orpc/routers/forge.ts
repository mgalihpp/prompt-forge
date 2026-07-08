import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { authed, base } from "@/lib/orpc/base";
import { prisma } from "@/lib/prisma";

// Knob values captured alongside each forged prompt. Loose by design — the
// composer's option set can grow without a migration.
const optsSchema = z.record(z.string(), z.string());

/** Derive a short human label from the ore for list/library display. */
function titleFromOre(ore: string): string {
  const clean = ore.replace(/\s+/g, " ").trim();
  return clean.length > 60
    ? `${clean.slice(0, 57)}…`
    : clean || "Untitled forge";
}

export const forgeRouter = {
  // ── Owner-scoped library ──────────────────────────────────────────────
  list: authed.handler(({ context }) =>
    prisma.forgedPrompt.findMany({
      where: { clerkId: context.userId },
      orderBy: [{ favorite: "desc" }, { createdAt: "desc" }],
    }),
  ),

  get: authed
    .input(z.object({ id: z.string() }))
    .handler(async ({ input, context }) => {
      const forge = await prisma.forgedPrompt.findFirst({
        where: { id: input.id, clerkId: context.userId },
      });
      if (!forge)
        throw new ORPCError("NOT_FOUND", { message: "Forge not found" });
      return forge;
    }),

  create: authed
    .input(
      z.object({
        ore: z.string().min(1),
        blade: z.string().min(1),
        opts: optsSchema.default({}),
        deepForge: z.boolean().default(false),
      }),
    )
    .handler(({ input, context }) =>
      prisma.forgedPrompt.create({
        data: {
          clerkId: context.userId,
          title: titleFromOre(input.ore),
          ore: input.ore,
          blade: input.blade,
          opts: input.opts,
          deepForge: input.deepForge,
        },
      }),
    ),

  delete: authed
    .input(z.object({ id: z.string() }))
    .handler(({ input, context }) =>
      prisma.forgedPrompt.deleteMany({
        where: { id: input.id, clerkId: context.userId },
      }),
    ),

  toggleFavorite: authed
    .input(z.object({ id: z.string(), favorite: z.boolean() }))
    .handler(({ input, context }) =>
      prisma.forgedPrompt.updateMany({
        where: { id: input.id, clerkId: context.userId },
        data: { favorite: input.favorite },
      }),
    ),

  // ── Sharing ───────────────────────────────────────────────────────────
  // Enable a public link by minting a shareId (idempotent — returns existing).
  share: authed
    .input(z.object({ id: z.string() }))
    .handler(async ({ input, context }) => {
      const forge = await prisma.forgedPrompt.findFirst({
        where: { id: input.id, clerkId: context.userId },
      });
      if (!forge)
        throw new ORPCError("NOT_FOUND", { message: "Forge not found" });
      if (forge.shareId) return { shareId: forge.shareId };

      const shareId = crypto.randomUUID();
      await prisma.forgedPrompt.update({
        where: { id: forge.id },
        data: { shareId },
      });
      return { shareId };
    }),

  unshare: authed
    .input(z.object({ id: z.string() }))
    .handler(({ input, context }) =>
      prisma.forgedPrompt.updateMany({
        where: { id: input.id, clerkId: context.userId },
        data: { shareId: null },
      }),
    ),

  // Public read by shareId — no auth. Only exposes what a shared card needs.
  getPublic: base
    .input(z.object({ shareId: z.string() }))
    .handler(async ({ input }) => {
      const forge = await prisma.forgedPrompt.findUnique({
        where: { shareId: input.shareId },
      });
      if (!forge) throw new ORPCError("NOT_FOUND", { message: "Not found" });
      return {
        title: forge.title,
        ore: forge.ore,
        blade: forge.blade,
        opts: forge.opts,
        deepForge: forge.deepForge,
        createdAt: forge.createdAt,
      };
    }),
};

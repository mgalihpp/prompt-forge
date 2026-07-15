import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { authed } from "@/lib/orpc/base";
import { prisma } from "@/lib/prisma";

export const historyRouter = {
  // ── Thread list & detail ──────────────────────────────────────────────
  threads: authed.handler(({ context }) =>
    prisma.chatThread.findMany({
      where: { clerkId: context.userId },
      orderBy: { updatedAt: "desc" },
      // capped at 100 by the trim in /api/chat, so no pagination needed
    }),
  ),

  messages: authed
    .input(z.object({ threadId: z.string() }))
    .handler(async ({ input, context }) => {
      const thread = await prisma.chatThread.findFirst({
        where: { id: input.threadId, clerkId: context.userId },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      });
      if (!thread)
        throw new ORPCError("NOT_FOUND", { message: "Thread not found" });
      return thread;
    }),

  // Called by the composer before the first send of a new conversation
  createThread: authed
    .input(z.object({ title: z.string().min(1).max(80) }))
    .handler(({ input, context }) =>
      prisma.chatThread.create({
        data: { clerkId: context.userId, title: input.title },
      }),
    ),

  // ── Keyword search ────────────────────────────────────────────────────
  search: authed
    .input(z.object({ q: z.string().min(2).max(100) }))
    .handler(({ input, context }) =>
      // ponytail: regex scan — fine at ≤100 threads; Atlas Search if scale matters
      prisma.chatMessage.findMany({
        where: {
          clerkId: context.userId,
          text: { contains: input.q, mode: "insensitive" },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { thread: { select: { id: true, title: true } } },
      }),
    ),

  // ── Deletion ──────────────────────────────────────────────────────────
  deleteMessages: authed
    .input(z.object({ ids: z.array(z.string()).min(1) }))
    .handler(({ input, context }) =>
      prisma.chatMessage.deleteMany({
        where: { id: { in: input.ids }, clerkId: context.userId },
      }),
    ),

  deleteThread: authed
    .input(z.object({ threadId: z.string() }))
    .handler(({ input, context }) =>
      prisma.chatThread.deleteMany({
        where: { id: input.threadId, clerkId: context.userId },
      }),
    ),
};

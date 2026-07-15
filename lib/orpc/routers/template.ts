import { z } from "zod";
import { authed } from "@/lib/orpc/base";
import { prisma } from "@/lib/prisma";

// Knob values captured alongside each template. Loose by design — the
// composer's option set can grow without a migration.
const optsSchema = z.record(z.string(), z.string());

export const templateRouter = {
  list: authed.handler(({ context }) =>
    prisma.promptTemplate.findMany({
      where: { clerkId: context.userId },
      orderBy: { createdAt: "desc" },
    }),
  ),

  create: authed
    .input(
      z.object({
        label: z.string().min(1).max(60),
        emoji: z.string().max(8).default("📝"),
        ore: z.string().min(1),
        opts: optsSchema.default({}),
        deepForge: z.boolean().default(false),
      }),
    )
    .handler(({ input, context }) =>
      prisma.promptTemplate.create({
        data: { clerkId: context.userId, ...input },
      }),
    ),

  delete: authed
    .input(z.object({ id: z.string() }))
    .handler(({ input, context }) =>
      prisma.promptTemplate.deleteMany({
        where: { id: input.id, clerkId: context.userId },
      }),
    ),
};

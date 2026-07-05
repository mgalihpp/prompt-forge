import { z } from "zod";
import { authed } from "@/lib/orpc/base";
import { prisma } from "@/lib/prisma";

export const projectRouter = {
  list: authed.handler(({ context }) =>
    prisma.project.findMany({
      where: { clerkId: context.userId },
      orderBy: { createdAt: "desc" },
    }),
  ),

  create: authed
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
      }),
    )
    .handler(({ input, context }) =>
      prisma.project.create({ data: { ...input, clerkId: context.userId } }),
    ),

  update: authed
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
      }),
    )
    .handler(({ input, context }) => {
      const { id, ...data } = input;
      return prisma.project.updateMany({
        where: { id, clerkId: context.userId },
        data,
      });
    }),

  delete: authed
    .input(z.object({ id: z.string() }))
    .handler(({ input, context }) =>
      prisma.project.deleteMany({
        where: { id: input.id, clerkId: context.userId },
      }),
    ),
};

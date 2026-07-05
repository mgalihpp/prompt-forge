import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { authed, base } from "@/lib/orpc/base";
import { prisma } from "@/lib/prisma";

export const userRouter = {
  // Upserts the DB user from Clerk on read, so the profile stays in sync
  me: authed.handler(async ({ context }) => {
    const cu = await currentUser();
    const email = cu?.emailAddresses[0]?.emailAddress ?? "";
    return prisma.user.upsert({
      where: { clerkId: context.userId },
      update: { email, name: cu?.fullName ?? undefined, avatar: cu?.imageUrl },
      create: {
        clerkId: context.userId,
        email,
        name: cu?.fullName ?? undefined,
        avatar: cu?.imageUrl,
      },
    });
  }),

  profile: base.input(z.object({ id: z.string() })).handler(({ input }) =>
    prisma.user.findUnique({
      where: { id: input.id },
      select: { id: true, name: true, email: true, avatar: true },
    }),
  ),
};

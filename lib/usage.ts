import { FREE_DAILY_LIMIT } from "@/lib/plans";
import { prisma } from "@/lib/prisma";

export { FREE_DAILY_LIMIT, LIMIT_MESSAGE } from "@/lib/plans";

/** Current UTC calendar day, the key the counter resets on. */
export function utcDay(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Prompts spent today by this user. */
export async function getUsage(clerkId: string) {
  const row = await prisma.dailyUsage.findUnique({
    where: { clerkId_day: { clerkId, day: utcDay() } },
  });
  return { used: row?.count ?? 0, limit: FREE_DAILY_LIMIT };
}

/** Read-only check: does this user have budget for one more prompt today? */
export async function checkUsage(clerkId: string): Promise<boolean> {
  const row = await prisma.dailyUsage.findUnique({
    where: { clerkId_day: { clerkId, day: utcDay() } },
  });
  return (row?.count ?? 0) < FREE_DAILY_LIMIT;
}

/**
 * Spend one prompt from today's quota. Atomic upsert-increment, so parallel
 * requests can't double-spend. Returns false when the user is at the limit —
 * the caller rejects the request.
 */
export async function trySpendPrompt(clerkId: string): Promise<boolean> {
  const day = utcDay();
  const updated = await prisma.dailyUsage.updateMany({
    where: { clerkId, day, count: { lt: FREE_DAILY_LIMIT } },
    data: { count: { increment: 1 } },
  });
  if (updated.count > 0) return true;

  // No row yet today, or already at the limit — create-or-check.
  try {
    await prisma.dailyUsage.create({ data: { clerkId, day, count: 1 } });
    return true;
  } catch {
    // Unique violation: a parallel request created the row first. Retry the
    // guarded increment once; a second miss really is the limit.
    const retry = await prisma.dailyUsage.updateMany({
      where: { clerkId, day, count: { lt: FREE_DAILY_LIMIT } },
      data: { count: { increment: 1 } },
    });
    return retry.count > 0;
  }
}

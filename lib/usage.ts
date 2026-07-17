import { FREE_DAILY_LIMIT } from "@/lib/plans";
import { prisma } from "@/lib/prisma";

export { FREE_DAILY_LIMIT, LIMIT_MESSAGE } from "@/lib/plans";

/** Current UTC calendar day, the key the counter resets on. */
export function utcDay(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Prompts spent today by this user. Pro users have no cap (`limit: null`). */
export async function getUsage(clerkId: string, isPro = false) {
  const row = await prisma.dailyUsage.findUnique({
    where: { clerkId_day: { clerkId, day: utcDay() } },
  });
  return { used: row?.count ?? 0, limit: isPro ? null : FREE_DAILY_LIMIT };
}

/** Read-only check: does this user have budget for one more prompt today? */
export async function checkUsage(
  clerkId: string,
  isPro = false,
): Promise<boolean> {
  if (isPro) return true;
  const row = await prisma.dailyUsage.findUnique({
    where: { clerkId_day: { clerkId, day: utcDay() } },
  });
  return (row?.count ?? 0) < FREE_DAILY_LIMIT;
}

/**
 * Spend one prompt from today's quota. Atomic upsert-increment, so parallel
 * requests can't double-spend. Returns false when the user is at the limit —
 * the caller rejects the request. Pro users still get counted (analytics) but
 * are never blocked: the `count < limit` guard is dropped so the increment
 * always applies.
 */
export async function trySpendPrompt(
  clerkId: string,
  isPro = false,
): Promise<boolean> {
  const day = utcDay();
  // The guard doubles as the limit enforcer, so pro must drop it entirely.
  const guard = isPro ? {} : { count: { lt: FREE_DAILY_LIMIT } };
  const updated = await prisma.dailyUsage.updateMany({
    where: { clerkId, day, ...guard },
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
      where: { clerkId, day, ...guard },
      data: { count: { increment: 1 } },
    });
    return retry.count > 0;
  }
}

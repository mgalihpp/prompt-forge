import "server-only";
import type { Plan } from "@/lib/plans";

/**
 * Resolve a user's plan from a Clerk session's `has` checker. Both the oRPC
 * context and the chat route already call `auth()`, so we take `has` rather
 * than calling `auth()` a second time. Unauthenticated users are always free.
 */
export function resolvePlan(
  userId: string | null,
  has: (params: { plan: string }) => boolean,
): Plan {
  return userId && has({ plan: "pro" }) ? "pro" : "free";
}

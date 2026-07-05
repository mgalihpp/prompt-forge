import { ORPCError, os } from "@orpc/server";

// Initial context injected by the HTTP handler / SSR router client
export type ORPCContext = {
  userId: string | null;
};

// Public procedure — no auth required
export const base = os.$context<ORPCContext>();

// Protected procedure — narrows userId to a non-null string
export const authed = base.use(({ context, next }) => {
  if (!context.userId) {
    throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
  }
  return next({ context: { userId: context.userId } });
});

"use client";

import { useAuth } from "@clerk/nextjs";

/**
 * Client-side Pro check from the Clerk session. No fetch — it reads the active
 * session's plan and updates after checkout/downgrade without a page reload.
 * Server routes enforce the same gate independently; this is UX only.
 */
export function useIsPro(): boolean {
  const { has, isLoaded } = useAuth();
  if (!isLoaded || !has) return false;
  return has({ plan: "pro" });
}

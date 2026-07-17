import { auth } from "@clerk/nextjs/server";
import { resolvePlan } from "@/lib/plan";
import type { ORPCContext } from "./base";

// Shared context factory used by both the HTTP handler and the SSR router client
export async function createORPCContext(): Promise<ORPCContext> {
  const { userId, has } = await auth();
  return { userId, plan: resolvePlan(userId, has) };
}

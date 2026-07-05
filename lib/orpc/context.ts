import { auth } from "@clerk/nextjs/server";
import type { ORPCContext } from "./base";

// Shared context factory used by both the HTTP handler and the SSR router client
export async function createORPCContext(): Promise<ORPCContext> {
  const { userId } = await auth();
  return { userId };
}

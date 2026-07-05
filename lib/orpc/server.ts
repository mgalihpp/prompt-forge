import "server-only";

import { createRouterClient } from "@orpc/server";
import { createORPCContext } from "./context";
import { router } from "./router";

// Per-request context via a function; assigned to the global so lib/orpc/client.ts
// (and the TanStack utils) call the router directly during SSR.
globalThis.$client = createRouterClient(router, {
  context: createORPCContext,
});

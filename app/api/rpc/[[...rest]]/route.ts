import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { createORPCContext } from "@/lib/orpc/context";
import { router } from "@/lib/orpc/router";

const handler = new RPCHandler(router, {
  interceptors: [onError((error) => console.error(error))],
});

async function handle(request: Request) {
  const { response } = await handler.handle(request, {
    prefix: "/api/rpc",
    context: await createORPCContext(),
  });

  return response ?? new Response("Not found", { status: 404 });
}

export const HEAD = handle;
export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;

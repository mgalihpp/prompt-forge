import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { Chat } from "@/features/chat/components/chat";
import { ThreadLoader } from "@/features/chat/components/thread-loader";
import { orpc } from "@/lib/orpc/client";
import { getQueryClient } from "@/lib/query-client.server";

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  const queryClient = getQueryClient();

  // fetchQuery (not prefetchQuery) so a missing/foreign thread bails here
  // instead of surfacing an error client-side.
  const thread = await queryClient
    .fetchQuery(orpc.history.messages.queryOptions({ input: { threadId } }))
    .catch(() => null);
  if (!thread) redirect("/chat");

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ThreadLoader threadId={threadId} />
      <Chat />
    </HydrationBoundary>
  );
}

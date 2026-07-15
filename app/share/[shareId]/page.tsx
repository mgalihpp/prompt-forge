import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SharedForge } from "@/features/forges/shared-forge";
import { orpc } from "@/lib/orpc/client";
import { getQueryClient } from "@/lib/query-client.server";

export default async function SharePage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    orpc.forge.getPublic.queryOptions({ input: { shareId } }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SharedForge shareId={shareId} />
    </HydrationBoundary>
  );
}

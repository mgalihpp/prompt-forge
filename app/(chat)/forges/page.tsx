import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ForgesView } from "@/features/forges/forges-view";
import { orpc } from "@/lib/orpc/client";
import { getQueryClient } from "@/lib/query-client.server";

export default async function ForgesPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(orpc.forge.list.queryOptions());

  return (
    <div className="flex w-full flex-1 flex-col">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          My Forges
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your saved prompts. Favorite, copy, share, or delete.
        </p>
      </div>
      <Suspense>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ForgesView />
        </HydrationBoundary>
      </Suspense>
    </div>
  );
}

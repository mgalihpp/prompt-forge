import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { orpc } from "@/lib/orpc/client";
import { getQueryClient } from "@/lib/query-client.server";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const queryClient = getQueryClient();

  // Prefetch on the server via the direct SSR client (no HTTP), then hydrate
  await Promise.all([
    queryClient.prefetchQuery(orpc.user.me.queryOptions()),
    queryClient.prefetchQuery(orpc.project.list.queryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}

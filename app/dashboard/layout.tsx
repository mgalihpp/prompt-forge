import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { type ReactNode, Suspense } from "react";
import { orpc } from "@/lib/orpc/client";
import { getQueryClient } from "@/lib/query-client.server";
import { DashboardSkeleton } from "./dashboard-skeleton";

// The awaited prefetch lives in an inner async component so the segment can
// stream: Suspense shows the skeleton immediately instead of blocking the
// whole route (a loading.tsx can't help here — it renders *inside* the
// layout, so an awaiting layout would block it too).
async function Prefetch({ children }: { children: ReactNode }) {
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

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Prefetch>{children}</Prefetch>
    </Suspense>
  );
}

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { BillingView } from "@/features/settings/billing-view";
import { orpc } from "@/lib/orpc/client";
import { getQueryClient } from "@/lib/query-client.server";

export default async function BillingSettingsPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(orpc.user.usage.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BillingView />
    </HydrationBoundary>
  );
}

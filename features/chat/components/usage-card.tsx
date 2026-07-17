"use client";

import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress, ProgressLabel } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { orpc } from "@/lib/orpc/client";
import { FREE_DAILY_LIMIT } from "@/lib/plans";

function UsageCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20 rounded-md" />
        <Skeleton className="h-4 w-12 rounded-md" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-1.5 w-full rounded-full" />
        <Skeleton className="h-3 w-28 rounded-md" />
      </div>
      <Skeleton className="h-9 w-full rounded-lg" />
    </div>
  );
}

function UsageCardContent({
  used,
  limit,
}: {
  used: number;
  limit: number;
}) {
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">Free Plan</span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {used} / {limit}
        </span>
      </div>
      <Progress value={used} max={limit} className="gap-1.5">
        <ProgressLabel className="text-xs font-normal text-muted-foreground">
          Prompts used today
        </ProgressLabel>
      </Progress>
      <Button variant="glossy" className="w-full">
        <Sparkles data-icon="inline-start" /> Upgrade to Pro
      </Button>
    </>
  );
}

/** Sidebar footer card: live daily-prompt usage + upgrade CTA. */
export function UsageCard() {
  const { data: usage } = useQuery(orpc.user.usage.queryOptions());

  const used = usage?.used ?? 0;
  const limit = usage?.limit ?? FREE_DAILY_LIMIT;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border bg-sidebar-accent/50 p-3 transition-opacity duration-300",
        "group-data-[collapsible=icon]:hidden",
      )}
    >
      {usage ? (
        <UsageCardContent used={used} limit={limit} />
      ) : (
        <UsageCardSkeleton />
      )}
    </div>
  );
}

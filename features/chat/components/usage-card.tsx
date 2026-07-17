"use client";

import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress, ProgressLabel } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { orpc } from "@/lib/orpc/client";
import { FREE_DAILY_LIMIT, type Plan } from "@/lib/plans";
import { cn } from "@/lib/utils";

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
  plan,
}: {
  used: number;
  limit: number;
  plan: Plan;
}) {
  if (plan === "pro") {
    return (
      <>
        {/* Corner glow so the Pro state reads richer than the flat free card */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-6 -right-6 size-16 rounded-full bg-primary/25 blur-xl"
        />
        <div className="relative flex items-center gap-2">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/30">
            <Sparkles className="size-3.5 text-primary" />
          </span>
          <span className="text-sm font-semibold">Pro Plan</span>
          <span className="ml-auto rounded-full bg-primary/15 px-2 py-0.5 text-[0.7rem] font-medium text-primary ring-1 ring-primary/25">
            Unlimited
          </span>
        </div>
      </>
    );
  }

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
      <Button
        variant="glossy"
        className="btn-shine w-full"
        nativeButton={false}
        render={<Link href="/settings/billing" />}
      >
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
  const plan = usage?.plan ?? "free";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border p-3 transition-opacity duration-300",
        // Pro styles the card itself — no inner panel, no card-in-card
        plan === "pro"
          ? "btn-shine [--shine-opacity:0.12] relative overflow-hidden border-primary/30 bg-linear-to-r from-primary/15 via-primary/5 to-primary/15"
          : "bg-sidebar-accent/50",
        "group-data-[collapsible=icon]:hidden",
      )}
    >
      {usage ? (
        <UsageCardContent used={used} limit={limit} plan={plan} />
      ) : (
        <UsageCardSkeleton />
      )}
    </div>
  );
}

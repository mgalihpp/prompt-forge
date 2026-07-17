"use client";

import { useQuery } from "@tanstack/react-query";
import { Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { orpc } from "@/lib/orpc/client";
import { FREE_DAILY_LIMIT, PRO_FEATURES } from "@/lib/plans";
import { cn } from "@/lib/utils";
import { UpgradeButton } from "./upgrade-button";

const FREE_FEATURES = [
  `${FREE_DAILY_LIMIT} prompts per day`,
  "Visual prompt composer",
  "AI-powered refinement",
  "Shareable prompt links",
];

export function BillingView() {
  const { data: usage } = useQuery(orpc.user.usage.queryOptions());

  const used = usage?.used ?? 0;
  const isPro = usage?.plan === "pro";
  // limit is null for pro (unlimited); free fallback keeps the bar sane
  const limit = usage?.limit ?? FREE_DAILY_LIMIT;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold">Plans &amp; usage</h1>
        <p className="text-sm text-muted-foreground">
          Your current plan and daily prompt allowance.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Free */}
        <div
          className={cn(
            "relative flex flex-col rounded-2xl border p-7",
            isPro
              ? "border-border bg-muted/40"
              : "border-primary/40 bg-card shadow-lg shadow-primary/10 ring-1 ring-primary/20",
          )}
        >
          {!isPro && (
            <Badge
              className="absolute -top-3 right-6 bg-white text-neutral-900"
              variant="secondary"
            >
              Current plan
            </Badge>
          )}

          <h3 className="text-lg font-semibold">Free</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Everything you need to start forging prompts.
          </p>

          <div className="mt-6 flex items-baseline gap-1">
            <span className="text-4xl font-bold tracking-tight">$0</span>
            <span className="text-sm text-muted-foreground">/forever</span>
          </div>

          <ul className="mt-6 flex flex-col gap-3">
            {FREE_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-2.5 text-sm">
                <Check className="size-4 shrink-0 text-primary" /> {feature}
              </li>
            ))}
          </ul>

          {/* Live usage for free users pins to the card bottom */}
          <div className="mt-auto pt-8">
            {isPro ? (
              <p className="text-center text-xs text-muted-foreground">
                Included with Pro
              </p>
            ) : usage ? (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Prompts used today</span>
                  <span className="tabular-nums">
                    <span className="font-semibold text-foreground">
                      {used}
                    </span>{" "}
                    / {limit}
                  </span>
                </div>
                <Progress value={used} max={limit} />
                <p className="text-xs text-muted-foreground">
                  Resets at midnight UTC.
                </p>
              </div>
            ) : (
              <Skeleton className="h-9 w-full" />
            )}
          </div>
        </div>

        {/* Pro */}
        <div className="relative flex flex-col rounded-2xl border border-primary/40 bg-card p-7 shadow-lg shadow-primary/10 ring-1 ring-primary/20">
          {/* Shine lives on an inset overlay: btn-shine needs overflow-hidden,
              which on the card itself would clip the -top-3 badge */}
          <div
            aria-hidden
            className="btn-shine [--shine-opacity:0.08] pointer-events-none absolute inset-0 rounded-2xl"
          />
          <Badge
            className={cn(
              "absolute -top-3 right-6",
              isPro ? "bg-white text-neutral-900" : "text-black",
            )}
            variant="default"
          >
            {isPro ? "Current plan" : "Most Popular"}
          </Badge>

          <h3 className="flex items-center gap-1.5 text-lg font-semibold">
            <Sparkles className="size-4 text-primary" /> Pro
          </h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Higher limits and more power for serious prompt smiths.
          </p>

          <div className="mt-6 flex items-baseline gap-1">
            <span className="text-4xl font-bold tracking-tight">$1</span>
            <span className="text-sm text-muted-foreground">/month</span>
          </div>

          <ul className="mt-6 flex flex-col gap-3">
            {PRO_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-2.5 text-sm">
                <Check className="size-4 shrink-0 text-primary" /> {feature}
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-8">
            {isPro ? (
              // Flat row — the Pro card itself is already the container
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Unlimited prompts</span>
                <span className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground tabular-nums">
                    {used}
                  </span>{" "}
                  forged today — keep going
                </span>
              </div>
            ) : (
              <UpgradeButton className="w-full" shine={false} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

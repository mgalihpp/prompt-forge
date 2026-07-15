"use client";

import { useQuery } from "@tanstack/react-query";
import { Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress, ProgressLabel } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { orpc } from "@/lib/orpc/client";
import { FREE_DAILY_LIMIT } from "@/lib/plans";

const PRO_FEATURES = [
  "Unlimited prompts per day",
  "Priority access to new models",
  "Longer prompt history",
  "Early access to new features",
];

export default function BillingSettingsPage() {
  const { data: usage } = useQuery(orpc.user.usage.queryOptions());

  const used = usage?.used ?? 0;
  const limit = usage?.limit ?? FREE_DAILY_LIMIT;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold">Plans &amp; usage</h1>
        <p className="text-sm text-muted-foreground">
          Your current plan and daily prompt allowance.
        </p>
      </div>

      {/* Current plan: Free */}
      <Card>
        <CardHeader>
          <CardTitle>Free Plan</CardTitle>
          <CardDescription>
            {FREE_DAILY_LIMIT} prompts per day, on the house.
          </CardDescription>
          <CardAction>
            <Badge variant="secondary">Current plan</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          {usage ? (
            <Progress value={used} max={limit} className="gap-2">
              <ProgressLabel className="text-xs font-normal text-muted-foreground">
                Prompts used today
              </ProgressLabel>
              <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                <span className="font-semibold text-foreground">{used}</span> /{" "}
                {limit}
              </span>
            </Progress>
          ) : (
            <Skeleton className="h-9 w-full" />
          )}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          Your allowance resets at midnight UTC.
        </CardFooter>
      </Card>

      {/* Pro plan teaser */}
      <Card className="ring-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-1.5">
            <Sparkles className="size-4 text-primary" /> Pro
          </CardTitle>
          <CardDescription>
            Higher limits and more power for serious prompt smiths.
          </CardDescription>
          <CardAction>
            <Badge variant="outline">Coming Soon</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2">
            {PRO_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <Check className="size-4 shrink-0 text-primary" /> {feature}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button variant="glossy" className="w-full" disabled>
            <Sparkles data-icon="inline-start" /> Upgrade to Pro
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

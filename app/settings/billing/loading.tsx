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
import { Skeleton } from "@/components/ui/skeleton";
import { FREE_DAILY_LIMIT, PRO_FEATURES } from "@/lib/plans";

/**
 * Shown while billing/page.tsx awaits the user.usage prefetch. BillingView is
 * almost entirely static copy, so this reproduces it verbatim and only the
 * usage progress pulses — same as BillingView's own pre-data state.
 */
export default function BillingLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold">Plans &amp; usage</h1>
        <p className="text-sm text-muted-foreground">
          Your current plan and daily prompt allowance.
        </p>
      </div>

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
          <Skeleton className="h-9 w-full" />
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          Your allowance resets at midnight UTC.
        </CardFooter>
      </Card>

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

import { Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FREE_DAILY_LIMIT, PRO_FEATURES } from "@/lib/plans";

const FREE_FEATURES = [
  `${FREE_DAILY_LIMIT} prompts per day`,
  "Visual prompt composer",
  "AI-powered refinement",
  "Shareable prompt links",
];

export default function BillingLoading() {
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
        <div className="relative flex flex-col rounded-2xl border border-primary/40 bg-card p-7 shadow-lg shadow-primary/10 ring-1 ring-primary/20">
          <Badge
            className="absolute -top-3 right-6 bg-white text-neutral-900"
            variant="secondary"
          >
            Current plan
          </Badge>

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

          <div className="mt-auto pt-8">
            <Skeleton className="h-9 w-full" />
          </div>
        </div>

        {/* Pro */}
        <div className="relative flex flex-col rounded-2xl border border-primary/40 bg-card p-7 shadow-lg shadow-primary/10 ring-1 ring-primary/20">
          <Badge
            className="absolute -top-3 right-6 text-black"
            variant="default"
          >
            Most Popular
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
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

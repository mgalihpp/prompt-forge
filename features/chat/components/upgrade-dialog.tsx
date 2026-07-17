"use client";

import { Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UpgradeButton } from "@/features/settings/upgrade-button";
import { FREE_DAILY_LIMIT, PRO_FEATURES } from "@/lib/plans";
import { useUpgradeDialog } from "../upgrade-dialog-store";

/**
 * Shown when a free user has spent their daily prompt quota. Opened by the
 * composer's pre-send check or the 429 fallback in the message list; the
 * upgrade CTA opens Clerk's checkout drawer via UpgradeButton. The dialog
 * itself is styled as the billing page's Pro card — no card-in-card nesting.
 */
export function UpgradeDialog() {
  const open = useUpgradeDialog((s) => s.open);
  const setOpen = useUpgradeDialog((s) => s.setOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-0 overflow-visible rounded-2xl border border-primary/40 bg-card p-7 shadow-lg shadow-primary/10 ring-primary/20 sm:max-w-md">
        <Badge className="absolute -top-3 right-6 text-black" variant="default">
          Most Popular
        </Badge>

        <DialogHeader className="gap-2">
          <DialogTitle className="flex items-center gap-1.5 text-lg font-semibold">
            <Sparkles className="size-4 text-primary" /> Pro
          </DialogTitle>
          <DialogDescription>
            You&apos;ve used all {FREE_DAILY_LIMIT} free prompts for today. Your
            allowance resets at midnight UTC — or go unlimited with Pro.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5 flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight">$1</span>
          <span className="text-sm text-muted-foreground">/month</span>
        </div>

        <ul className="mt-5 flex flex-col gap-2.5">
          {PRO_FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-2.5 text-sm">
              <Check className="size-4 shrink-0 text-primary" /> {feature}
            </li>
          ))}
        </ul>

        <div className="pt-7">
          <UpgradeButton className="w-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
}

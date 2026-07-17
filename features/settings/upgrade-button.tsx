"use client";

import { useAuth } from "@clerk/nextjs";
import { CheckoutButton, usePlans } from "@clerk/nextjs/experimental";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Wraps our own glossy button with Clerk's <CheckoutButton>, which opens the
 * hosted checkout drawer on click — so the pricing UI stays entirely ours
 * while Clerk handles payment. The `pro` plan id is looked up from the
 * Dashboard by slug (no hardcoded cplan_ id / env).
 *
 * Signed-out users are routed to sign-up; CheckoutButton requires a session.
 */
export function UpgradeButton({
  className,
  label = "Upgrade to Pro",
  shine = true,
}: {
  className?: string;
  label?: string;
  /** Disable when the surrounding card already carries the shine sweep. */
  shine?: boolean;
}) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const { data: plans } = usePlans({ for: "user" });
  const proPlan = plans?.find((p) => p.slug === "pro");

  const glossy = (
    <Button
      variant="glossy"
      size="lg"
      className={cn(shine && "btn-shine", className)}
    >
      <Sparkles className="size-4" /> {label}
    </Button>
  );

  // Not signed in, or plans still loading / plan not configured yet: send the
  // user somewhere sensible instead of a dead button.
  if (!isSignedIn || !proPlan) {
    return (
      <Button
        variant="glossy"
        size="lg"
        className={cn(shine && "btn-shine", className)}
        onClick={() =>
          router.push(isSignedIn ? "/settings/billing" : "/sign-up")
        }
      >
        <Sparkles className="size-4" /> {label}
      </Button>
    );
  }

  return (
    <CheckoutButton
      planId={proPlan.id}
      planPeriod="month"
      for="user"
      newSubscriptionRedirectUrl="/chat"
    >
      {glossy}
    </CheckoutButton>
  );
}

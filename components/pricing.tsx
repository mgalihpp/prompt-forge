"use client";

import { useAuth } from "@clerk/nextjs";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FREE_DAILY_LIMIT, PRO_FEATURES } from "@/lib/plans";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Plans mirror the billing settings page. Checkout itself happens on
// /settings/billing via Clerk's PricingTable; these cards just route there.
const PLANS = [
  {
    name: "Free",
    price: 0,
    period: "/forever",
    tagline: "Everything you need to start forging prompts.",
    cta: "Start Building",
    features: [
      `${FREE_DAILY_LIMIT} prompts per day`,
      "Visual prompt composer",
      "AI-powered refinement",
      "Shareable prompt links",
    ],
    featured: false,
  },
  {
    name: "Pro",
    price: 1,
    period: "/month",
    tagline: "Higher limits and more power for serious prompt smiths.",
    cta: "Upgrade to Pro",
    features: PRO_FEATURES,
    featured: true,
  },
];

export function Pricing() {
  const { isSignedIn } = useAuth();
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReduced) return;

      // Heading block fades up as the section scrolls into view.
      gsap.from("[data-pricing-heading] > *", {
        y: 28,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 78%",
          once: true,
        },
      });

      // Cards rise in with a stagger; the featured card lands last.
      gsap.from("[data-pricing-card]", {
        y: 48,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-pricing-grid]",
          start: "top 82%",
          once: true,
        },
      });

      // Price counters tick up from 0 once the cards are visible.
      gsap.utils.toArray<HTMLElement>("[data-price-value]").forEach((el) => {
        gsap.from(el, {
          textContent: 0,
          duration: 1.1,
          ease: "power1.out",
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: "[data-pricing-grid]",
            start: "top 82%",
            once: true,
          },
        });
      });
    },
    { scope: container },
  );

  return (
    <section
      ref={container}
      id="pricing"
      className="relative mx-auto max-w-5xl px-4 py-24 sm:py-32"
    >
      {/* Ambient glow behind the featured card */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/3 mx-auto h-72 max-w-2xl rounded-full bg-primary/10 blur-3xl"
      />

      {/* Heading */}
      <div
        data-pricing-heading
        className="relative mx-auto max-w-xl text-center"
      >
        <Badge variant="secondary" className="mb-4 gap-1.5">
          <Sparkles className="size-3 text-primary" /> Pricing
        </Badge>
        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
          Simple plans, <span className="text-primary">honest pricing</span>
        </h2>
        <p className="mt-4 text-pretty text-base text-muted-foreground sm:text-lg">
          Start free, upgrade when you are ready. No hidden fees, no surprises —
          your allowance resets every day.
        </p>
      </div>

      {/* Plan cards */}
      <div
        data-pricing-grid
        className="relative mx-auto mt-14 grid max-w-3xl gap-6 sm:grid-cols-2"
      >
        {PLANS.map(
          ({ name, price, period, tagline, cta, features, featured }) => (
            <div
              key={name}
              data-pricing-card
              className={
                featured
                  ? "relative flex flex-col rounded-2xl border border-primary/40 bg-card p-7 shadow-lg shadow-primary/10 ring-1 ring-primary/20"
                  : "relative flex flex-col rounded-2xl border border-border bg-muted/40 p-7"
              }
            >
              {featured && (
                <Badge className="absolute -top-3 right-6" variant="default">
                  Most Popular
                </Badge>
              )}

              <h3 className="text-lg font-semibold">{name}</h3>

              <p className="mt-3 text-sm text-muted-foreground">{tagline}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">
                  $<span data-price-value={price}>{price}</span>
                </span>
                <span className="text-sm text-muted-foreground">{period}</span>
              </div>

              <ul className="mt-6 flex flex-col gap-3">
                {features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2.5 text-sm"
                  >
                    <Check className="size-4 shrink-0 text-primary" /> {feature}
                  </li>
                ))}
              </ul>

              {/* mt-auto pins CTAs to the card bottom so both stay aligned */}
              <div className="mt-auto pt-8">
                {featured ? (
                  <Link
                    href={isSignedIn ? "/settings/billing" : "/sign-up"}
                    className="block"
                  >
                    <Button variant="glossy" size="lg" className="w-full">
                      <Sparkles className="size-4" /> {cta}
                    </Button>
                  </Link>
                ) : (
                  <Link
                    href={isSignedIn ? "/chat" : "/sign-up"}
                    className="block"
                  >
                    <Button variant="glossy" size="lg" className="w-full">
                      {cta}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
}

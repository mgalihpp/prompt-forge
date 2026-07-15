"use client";

import { useAuth } from "@clerk/nextjs";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  ArrowUpRight,
  PlayCircle,
  Search,
  Sparkles,
  Wand2,
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(useGSAP);

// Quick-action chips shown inside the prompt composer.
const QUICK_ACTIONS = [
  { icon: Wand2, label: "Refine Prompt" },
  { icon: Sparkles, label: "Improve Clarity" },
  { icon: Search, label: "Add Context" },
];

export function Hero() {
  const { isSignedIn } = useAuth();
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Entrance timeline: pill → headline → copy → CTAs → composer.
      // Targets are stable wrappers (not auth-dependent children) and
      // clearProps removes GSAP's inline styles once each tween finishes,
      // so Clerk-triggered re-renders can't leave elements stuck hidden.
      gsap
        .timeline({
          defaults: {
            ease: "power3.out",
            clearProps: "opacity,visibility,transform",
          },
        })
        .from("[data-hero-pill]", { y: 24, autoAlpha: 0, duration: 0.6 })
        .from(
          "[data-hero-title]",
          { y: 32, autoAlpha: 0, duration: 0.8 },
          "-=0.35",
        )
        .from(
          "[data-hero-copy]",
          { y: 24, autoAlpha: 0, duration: 0.6 },
          "-=0.5",
        )
        .from(
          "[data-hero-cta]",
          { y: 16, autoAlpha: 0, duration: 0.5 },
          "-=0.4",
        )
        .from(
          "[data-hero-composer]",
          { y: 40, autoAlpha: 0, scale: 0.98, duration: 0.8 },
          "-=0.3",
        );
    },
    { scope: container },
  );

  return (
    <main
      ref={container}
      className="mx-auto flex max-w-3xl flex-col items-center px-4 pt-16 pb-24 text-center sm:pt-24"
    >
      {/* Announcement pill — soft aura glow tuned per theme */}
      <div data-hero-pill className="relative mb-8">
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-x-6 -inset-y-4 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--primary)_35%,transparent),transparent)] blur-lg dark:bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--primary)_25%,transparent),transparent)]"
        />
        <Link
          href="#"
          className="relative inline-flex items-center gap-2 rounded-full border border-primary/25 bg-secondary/90 p-1 pr-3 text-sm text-secondary-foreground backdrop-blur"
        >
          <span className="rounded-full bg-primary px-2.5 py-0.5 font-medium text-primary-foreground">
            Introducing
          </span>
          <span className="inline-flex items-center gap-0.5 font-medium text-primary">
            Forge 1 <ArrowUpRight className="size-3.5" />
          </span>
        </Link>
      </div>

      {/* Headline — accent color themed to app primary (teal) */}
      <h1
        data-hero-title
        className="text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl"
      >
        Turn Rough Ideas into{" "}
        <span className="text-primary">Reliable Prompts</span>
      </h1>

      <p
        data-hero-copy
        className="mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg"
      >
        The workspace for teams to craft prompts visually, refine them with AI,
        and ship production-ready results while we handle the rest.
      </p>

      {/* Primary actions */}
      <div
        data-hero-cta
        className="mt-8 flex flex-wrap items-center justify-center gap-3"
      >
        <Button variant="secondary" size="lg" className="gap-2">
          <PlayCircle className="size-4" /> Watch Video
        </Button>
        <Link href={isSignedIn ? "/chat" : "/sign-up"}>
          <Button variant="glossy" size="lg">
            {isSignedIn ? "Open Chat" : "Start Building"}
          </Button>
        </Link>
      </div>

      {/* Prompt composer card */}
      <div
        data-hero-composer
        className="mt-14 w-full rounded-2xl border border-border bg-muted/40 p-3 text-left shadow-sm"
      >
        <textarea
          rows={4}
          placeholder="Describe the prompt you want to build — e.g. a bot that summarizes support tickets"
          className="w-full resize-none bg-transparent px-2 pt-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />

        {/* Toolbar: quick actions + send. Wraps on mobile. */}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {QUICK_ACTIONS.map(({ icon: Icon, label }) => (
            <button
              key={label}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icon className="size-3.5" /> {label}
            </button>
          ))}
          <Button variant="glossy" className="ml-auto gap-1.5">
            Send <ArrowUpRight className="size-4" />
          </Button>
        </div>
      </div>
    </main>
  );
}

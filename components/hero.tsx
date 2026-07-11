"use client";

import { useAuth } from "@clerk/nextjs";
import {
  ArrowUpRight,
  CreditCard,
  PlayCircle,
  Search,
  Sparkles,
  Wand2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Quick-action chips shown inside the prompt composer.
const QUICK_ACTIONS = [
  { icon: Wand2, label: "Refine Prompt" },
  { icon: Sparkles, label: "Improve Clarity" },
  { icon: Search, label: "Add Context" },
];

export function Hero() {
  const { isSignedIn } = useAuth();

  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center px-4 pt-16 pb-24 text-center sm:pt-24">
      {/* Announcement pill */}
      <Link
        href="#"
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary p-1 pr-3 text-sm text-secondary-foreground"
      >
        <span className="rounded-full bg-primary px-2.5 py-0.5 font-medium text-primary-foreground">
          Introducing
        </span>
        <span className="inline-flex items-center gap-0.5 font-medium text-primary">
          Forge 1 <ArrowUpRight className="size-3.5" />
        </span>
      </Link>

      {/* Headline — accent color themed to app primary (teal) */}
      <h1 className="text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
        Turn Rough Ideas into{" "}
        <span className="text-primary">Reliable Prompts</span>
      </h1>

      <p className="mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
        The workspace for teams to craft prompts visually, refine them with AI,
        and ship production-ready results while we handle the rest.
      </p>

      {/* Primary actions */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
      <div className="mt-14 w-full rounded-2xl border border-border bg-muted/40 p-3 text-left shadow-sm">
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

      <p className="mt-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <CreditCard className="size-3.5" /> No credit card required
      </p>
    </main>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Forgy, type ForgyState } from "./forgy";

/** Greeting shown on every Forgy mascot — empty state and in-thread alike. */
export const FORGY_GREETING = "Hi, I'm Forgy. How can I help you today?";

/** Wave duration — keep in sync with the `forgyWave` keyframe in forgy.module.css. */
const WAVE_MS = 1400;

/**
 * Forgy wrapped in a hover tooltip. `className` sizes/positions the mascot
 * (e.g. `size-24` for the empty-state hero, `mt-4 size-12` inline in a turn).
 *
 * Clicking Forgy makes him wave. With `autoWave`, he also greets on his own —
 * an initial wave shortly after mount, then periodically — but only while idle,
 * so it never fights the thinking/busy/success arm animations.
 */
export function ForgyMascot({
  state = "idle",
  className,
  autoWave = false,
}: {
  state?: ForgyState;
  className?: string;
  autoWave?: boolean;
}) {
  const [waving, setWaving] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Wave only in the resting pose; every other state already uses the arms.
  // Toggle the class off then on so repeat clicks always restart the gesture.
  const wave = useCallback(() => {
    if (stateRef.current !== "idle") return;
    if (timer.current) clearTimeout(timer.current);
    setWaving(false);
    requestAnimationFrame(() => {
      setWaving(true);
      timer.current = setTimeout(() => setWaving(false), WAVE_MS);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    if (!autoWave || state !== "idle") return;
    const hello = setTimeout(wave, 600);
    const loop = setInterval(wave, 7000);
    return () => {
      clearTimeout(hello);
      clearInterval(loop);
    };
  }, [autoWave, state, wave]);

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            className={cn("block cursor-pointer select-none", className)}
            onClick={wave}
          />
        }
      >
        <Forgy state={state} waving={waving} />
      </TooltipTrigger>
      <TooltipContent>{FORGY_GREETING}</TooltipContent>
    </Tooltip>
  );
}

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Forgy, type ForgyState } from "./forgy";

/** Greeting shown on every Forgy mascot — empty state and in-thread alike. */
export const FORGY_GREETING = "Hi, I'm Forgy. How can I help you today?";

/**
 * Forgy wrapped in a hover tooltip. `className` sizes/positions the mascot
 * (e.g. `size-24` for the empty-state hero, `mt-4 size-12` inline in a turn).
 */
export function ForgyMascot({
  state = "idle",
  className,
}: {
  state?: ForgyState;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={<span className={cn("block cursor-help", className)} />}
      >
        <Forgy state={state} />
      </TooltipTrigger>
      <TooltipContent>{FORGY_GREETING}</TooltipContent>
    </Tooltip>
  );
}

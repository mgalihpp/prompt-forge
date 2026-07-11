import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { wordDiff } from "@/lib/word-diff";

/**
 * Ore → blade word-level diff. Additions (what the forge introduced) are
 * highlighted green; removals from the original struck through in red.
 */
export function ForgeDiff({ ore, blade }: { ore: string; blade: string }) {
  const parts = useMemo(() => wordDiff(ore, blade), [ore, blade]);

  return (
    <div className="rounded-lg border bg-muted/30 p-3 text-sm leading-6 whitespace-pre-wrap">
      {parts.map((p, i) => (
        <span
          key={`${i}-${p.type}-${p.value}`}
          className={cn(
            p.type === "add" &&
              "rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
            p.type === "del" &&
              "rounded bg-red-500/10 text-red-600/70 line-through dark:text-red-400/70",
          )}
        >
          {p.value}
        </span>
      ))}
    </div>
  );
}

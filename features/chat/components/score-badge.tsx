import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** Compact 0–10 score chip, color-stepped by quality. */
export function ScoreBadge({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "px-1.5 font-mono text-[10px] tabular-nums",
        score >= 8
          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
          : score >= 6
            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
            : "bg-muted text-muted-foreground",
        className,
      )}
    >
      {score.toFixed(1)}
    </Badge>
  );
}

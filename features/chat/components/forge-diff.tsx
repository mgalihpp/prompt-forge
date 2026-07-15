import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { diffStats, wordDiff } from "@/lib/word-diff";

/**
 * Ore → blade word-level diff. Additions (what the forge introduced) are
 * highlighted green; removals from the original struck through in red.
 * Supports an inline (unified) view and a side-by-side view.
 */
export function ForgeDiff({ ore, blade }: { ore: string; blade: string }) {
  const parts = useMemo(() => wordDiff(ore, blade), [ore, blade]);
  const stats = useMemo(() => diffStats(parts), [parts]);
  const [mode, setMode] = useState<"inline" | "split">("inline");

  const unchanged = stats.added === 0 && stats.removed === 0;

  return (
    <div className="overflow-hidden rounded-lg border bg-muted/30">
      <div className="flex flex-wrap items-center gap-2 border-b bg-muted/40 px-3 py-1.5 text-xs">
        <span className="font-medium text-muted-foreground">Changes</span>
        {unchanged ? (
          <span className="text-muted-foreground">no word changes</span>
        ) : (
          <>
            <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 font-medium text-emerald-700 dark:text-emerald-300">
              +{stats.added}
            </span>
            <span className="rounded bg-red-500/10 px-1.5 py-0.5 font-medium text-red-600/80 dark:text-red-400/80">
              −{stats.removed}
            </span>
          </>
        )}
        <div className="ml-auto flex gap-0.5">
          <ModeBtn
            label="Inline"
            active={mode === "inline"}
            onClick={() => setMode("inline")}
          />
          <ModeBtn
            label="Split"
            active={mode === "split"}
            onClick={() => setMode("split")}
          />
        </div>
      </div>

      {mode === "inline" ? (
        <div className="p-3 text-sm leading-6 whitespace-pre-wrap">
          <DiffText parts={parts} show="both" />
        </div>
      ) : (
        <div className="grid grid-cols-1 divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <div className="min-w-0 p-3">
            <div className="mb-1.5 text-xs font-medium text-muted-foreground">
              Original
            </div>
            <div className="text-sm leading-6 whitespace-pre-wrap">
              <DiffText parts={parts} show="del" />
            </div>
          </div>
          <div className="min-w-0 p-3">
            <div className="mb-1.5 text-xs font-medium text-muted-foreground">
              Forged
            </div>
            <div className="text-sm leading-6 whitespace-pre-wrap">
              <DiffText parts={parts} show="add" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Renders diff parts. `show` picks the side: "both" is the unified view;
 * "del" renders original text (removals highlighted, additions dropped);
 * "add" renders forged text (additions highlighted, removals dropped).
 */
function DiffText({
  parts,
  show,
}: {
  parts: ReturnType<typeof wordDiff>;
  show: "both" | "add" | "del";
}) {
  return (
    <>
      {parts.map((p, i) => {
        if (show === "add" && p.type === "del") return null;
        if (show === "del" && p.type === "add") return null;
        return (
          <span
            key={`${i}-${p.type}`}
            className={cn(
              p.type === "add" &&
                "rounded-sm bg-emerald-500/15 px-0.5 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
              p.type === "del" &&
                "rounded-sm bg-red-500/10 px-0.5 text-red-600/70 dark:bg-red-500/15 dark:text-red-400/70",
              p.type === "del" && show === "both" && "line-through",
            )}
          >
            {p.value}
          </span>
        );
      })}
    </>
  );
}

function ModeBtn({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      size="sm"
      className="h-6 rounded px-2 text-xs"
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

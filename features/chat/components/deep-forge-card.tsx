"use client";

import { ChevronRight, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Markdown } from "@/components/ui/markdown";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AXIS_LABELS,
  type ForgeReviewData,
  type ForgeVariantData,
  type ScoredVerdict,
  type VariantLabel,
  VERDICT_AXES,
} from "@/lib/deep-forge";
import { cn } from "@/lib/utils";
import { ScoreBadge } from "./score-badge";

/**
 * The Deep Forge result surface: one card, three variant tabs (A/B/C), each
 * with its forged prompt, a collapsible critique (strengths/weaknesses +
 * rubric breakdown), and a score chip in the tab label once judging lands.
 */
export function DeepForgeCard({
  variants,
  review,
  streaming,
  active,
  onActiveChange,
}: {
  variants: ForgeVariantData[];
  review: ForgeReviewData | undefined;
  streaming: boolean;
  active: VariantLabel;
  onActiveChange: (label: VariantLabel) => void;
}) {
  const verdicts = review?.status === "done" ? review.verdicts : undefined;

  return (
    <div className="group/assistant flex w-full min-w-0 flex-col gap-1.5">
      <div className="min-w-0 rounded-2xl rounded-tl-md border bg-card px-4 py-3 text-card-foreground shadow-sm">
        <Tabs
          value={active}
          onValueChange={(v) => onActiveChange(v as VariantLabel)}
        >
          <TabsList className="w-full">
            {variants.map((v) => (
              <TabsTrigger key={v.label} value={v.label} className="gap-1.5">
                <span>
                  {v.label}
                  <span className="ml-1 hidden text-xs font-normal text-muted-foreground sm:inline">
                    · {v.angle}
                  </span>
                </span>
                {verdicts ? (
                  <ScoreBadge score={verdicts[v.label].score} />
                ) : v.status === "streaming" ? (
                  <Spinner className="size-3" />
                ) : null}
              </TabsTrigger>
            ))}
          </TabsList>

          {variants.map((v) => (
            <TabsContent key={v.label} value={v.label}>
              {v.text ? (
                <Markdown>{v.text}</Markdown>
              ) : v.status === "error" ? (
                <p className="text-xs text-destructive">
                  This variant failed to generate. Try another tab or
                  regenerate.
                </p>
              ) : (
                <span className="inline-block h-4 w-2 animate-pulse rounded-sm bg-muted-foreground/50 align-middle" />
              )}

              <Critique
                review={review}
                verdict={verdicts?.[v.label]}
                variantStatus={v.status}
                streaming={streaming}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

// Collapsed by default, mirroring the Reasoning trail on standard turns: the
// forged prompt is the headline, the critique is supporting detail.
function Critique({
  review,
  verdict,
  variantStatus,
  streaming,
}: {
  review: ForgeReviewData | undefined;
  verdict: ScoredVerdict | undefined;
  variantStatus: ForgeVariantData["status"];
  streaming: boolean;
}) {
  const [open, setOpen] = useState(false);

  if (review?.status === "error") return null;
  if (!verdict) {
    // No verdict yet: either this variant is still forging, or all variants
    // are done and the critic is judging. Gate on the live streaming flag so
    // an aborted turn (review stuck at "judging") doesn't spin forever.
    if (review?.status !== "judging" || !streaming) return null;
    return (
      <div className="mt-2.5 flex items-center gap-1.5 border-t border-dashed pt-2.5 text-xs text-muted-foreground">
        <Spinner className="size-3" />
        {variantStatus === "streaming"
          ? "Forging variants…"
          : "Judging variants…"}
      </div>
    );
  }

  return (
    <div className="mt-2.5 border-t border-dashed pt-2.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronRight
          className={cn("size-3.5 transition-transform", open && "rotate-90")}
        />
        Critique
        <ScoreBadge score={verdict.score} className="ml-1" />
      </button>
      {open && (
        <div className="mt-2 flex flex-col gap-2 text-xs leading-relaxed text-muted-foreground">
          <ul className="flex flex-col gap-1">
            {verdict.strengths.map((s) => (
              <li key={s} className="flex gap-1.5">
                <Plus className="mt-0.5 size-3 shrink-0 text-emerald-500" />
                <span>{s}</span>
              </li>
            ))}
            {verdict.weaknesses.map((w) => (
              <li key={w} className="flex gap-1.5">
                <Minus className="mt-0.5 size-3 shrink-0 text-amber-500" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-0.5 sm:grid-cols-3">
            {VERDICT_AXES.map((axis) => (
              <div key={axis} className="flex justify-between gap-2">
                <dt>{AXIS_LABELS[axis]}</dt>
                <dd className="font-mono tabular-nums">{verdict[axis]}/5</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}

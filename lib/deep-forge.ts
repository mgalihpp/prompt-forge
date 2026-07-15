import type { UIMessage } from "ai";
import { z } from "zod";

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  DEEP FORGE — VARIANTS PIPELINE (shared types + schema)
 * ─────────────────────────────────────────────────────────────────────────
 *  Client-safe module. Single source of truth for the A/B/C variant data
 *  parts streamed by the API route and rendered by the chat UI.
 */

export const VARIANT_LABELS = ["A", "B", "C"] as const;
export type VariantLabel = (typeof VARIANT_LABELS)[number];

/** Three deliberately distinct forging angles — one per variant. */
export const VARIANT_ANGLES: Record<
  VariantLabel,
  { name: string; directive: string }
> = {
  A: {
    name: "Precision",
    directive:
      "Forge the tightest prompt that still fully pins down the objective, hard constraints, and output spec. Dial CALIBRATION to maximum: cut every clause that is not load-bearing, prefer one exact sentence over three approximate ones, and let brevity itself be the quality signal. No scaffolding the task does not strictly need.",
  },
  B: {
    name: "Comprehensive",
    directive:
      "Build the most complete prompt this task can justify: authoritative expert role, explicit step-by-step reasoning and self-verification, rich context, edge cases and failure modes, a success rubric the model can grade itself against, and a concrete output template or example. Dense with signal, zero filler.",
  },
  C: {
    name: "Reframed",
    directive:
      "Re-derive the user's underlying goal, then attack it from a genuinely different angle than the obvious forge: an alternative expert persona, a different task decomposition, or an unexpected but fitting output structure. The goal, the user's language, and every hard constraint stay identical — only the strategy changes. The reframe must plausibly produce a BETTER downstream result, not merely a different one.",
  },
};

/** Payload of a `data-forge-variant` part. Rewritten in place while streaming. */
export type ForgeVariantData = {
  label: VariantLabel;
  angle: string;
  text: string;
  status: "streaming" | "done" | "error";
};

const axis = z.number().int().min(1).max(5);

/** Per-variant verdict — same 5-axis rubric as the offline eval judge. */
export const VariantVerdict = z.object({
  strengths: z
    .array(z.string())
    .min(1)
    .max(3)
    .describe("1–3 short bullet points: what this variant does well."),
  weaknesses: z
    .array(z.string())
    .min(1)
    .max(3)
    .describe("1–3 short bullet points: where this variant falls short."),
  intentFidelity: axis.describe(
    "Does the variant preserve the user's true intent, domain, language, and every concrete detail from the ore?",
  ),
  specificityGain: axis.describe(
    "How much sharper/more actionable is the variant vs the vague ore? 5 = dramatic, well-justified gain.",
  ),
  structure: axis.describe(
    "Is it well-structured for a downstream LLM (role/objective/context/constraints/output spec as warranted)?",
  ),
  formatCompliance: axis.describe(
    "Does it obey the requested output format and contract (no preamble/meta-commentary)?",
  ),
  didNotAnswer: axis.describe(
    "CRITICAL: is it a PROMPT for another AI, NOT an answer to the ore? 5 = clearly a prompt. 1 = it answered instead.",
  ),
});
export type VariantVerdict = z.infer<typeof VariantVerdict>;

/** What the single critic call returns for all three variants at once. */
export const DeepForgeReviewSchema = z.object({
  A: VariantVerdict,
  B: VariantVerdict,
  C: VariantVerdict,
  followUps: z
    .array(z.string().max(120))
    .min(2)
    .max(4)
    .describe(
      "Short refinement requests the user could send next (e.g. 'make it shorter', 'add examples'), written in the user's language. Each must be a prompt-refinement ask, never an answer.",
    ),
});

export type ScoredVerdict = VariantVerdict & { score: number };

/** Payload of the `data-forge-review` part. */
export type ForgeReviewData =
  | { status: "judging" }
  | {
      status: "done";
      verdicts: Record<VariantLabel, ScoredVerdict>;
      followUps: string[];
    }
  | { status: "error" };

const AXES = [
  "intentFidelity",
  "specificityGain",
  "structure",
  "formatCompliance",
  "didNotAnswer",
] as const;

export const AXIS_LABELS: Record<(typeof AXES)[number], string> = {
  intentFidelity: "Intent fidelity",
  specificityGain: "Specificity gain",
  structure: "Structure",
  formatCompliance: "Format compliance",
  didNotAnswer: "Prompt (not answer)",
};

export { AXES as VERDICT_AXES };

/** Average of the 5 axes mapped to a 0–10 scale, one decimal. */
export function verdictScore(v: VariantVerdict): number {
  const sum = AXES.reduce((acc, k) => acc + v[k], 0);
  return Math.round((sum / AXES.length) * 2 * 10) / 10;
}

/** Highest-scored variant label (ties resolve to the earlier label). */
export function bestLabel(
  review: Extract<ForgeReviewData, { status: "done" }>,
): VariantLabel {
  let best: VariantLabel = "A";
  for (const label of VARIANT_LABELS) {
    if (review.verdicts[label].score > review.verdicts[best].score) {
      best = label;
    }
  }
  return best;
}

// ── typed UIMessage ────────────────────────────────────────────────────────

export type ForgeDataParts = {
  "forge-variant": ForgeVariantData;
  "forge-review": ForgeReviewData;
};

export type ForgeUIMessage = UIMessage<unknown, ForgeDataParts>;

/** All variant parts of a message, sorted A → B → C. */
export function variantParts(m: UIMessage): ForgeVariantData[] {
  return m.parts
    .filter(
      (p): p is { type: "data-forge-variant"; data: ForgeVariantData } =>
        p.type === "data-forge-variant",
    )
    .map((p) => p.data)
    .sort((a, b) => a.label.localeCompare(b.label));
}

/** The review part of a message, if any. */
export function reviewPart(m: UIMessage): ForgeReviewData | undefined {
  const part = m.parts.find(
    (p): p is { type: "data-forge-review"; data: ForgeReviewData } =>
      p.type === "data-forge-review",
  );
  return part?.data;
}

export function isDeepForgeMessage(m: UIMessage): boolean {
  return m.parts.some((p) => p.type === "data-forge-variant");
}

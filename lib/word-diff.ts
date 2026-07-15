/**
 * Word-level diff for the ore → blade comparison view, backed by jsdiff's
 * `diffWords`. Unlike the old hand-rolled LCS (which tokenized whitespace and
 * often mis-aligned on spaces instead of words), jsdiff ignores whitespace
 * when matching but preserves it in the output, so identical words never get
 * flagged as changed just because spacing shifted.
 */
import { diffWords } from "diff";

export type DiffPart = { type: "same" | "add" | "del"; value: string };

// Intl.Segmenter gives proper word boundaries (punctuation, CJK, etc.) when
// the runtime supports it; jsdiff falls back to its regex tokenizer otherwise.
const intlSegmenter =
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter(undefined, { granularity: "word" })
    : undefined;

export function wordDiff(before: string, after: string): DiffPart[] {
  const changes = diffWords(before, after, {
    intlSegmenter,
    // Bail out on pathological inputs instead of freezing the UI.
    timeout: 1000,
  });

  // jsdiff returns undefined when the timeout is hit — degrade to a whole-text
  // replace so the view still renders something sensible.
  if (!changes) {
    const parts: DiffPart[] = [];
    if (before) parts.push({ type: "del", value: before });
    if (before && after) parts.push({ type: "same", value: "\n" });
    if (after) parts.push({ type: "add", value: after });
    return parts;
  }

  const parts: DiffPart[] = [];
  for (const c of changes) {
    if (!c.value) continue;
    const type: DiffPart["type"] = c.added ? "add" : c.removed ? "del" : "same";
    const last = parts[parts.length - 1];
    if (last && last.type === type) last.value += c.value;
    else parts.push({ type, value: c.value });
  }
  return parts;
}

/** Word counts for the diff summary chips (whitespace-only parts excluded). */
export function diffStats(parts: DiffPart[]): {
  added: number;
  removed: number;
} {
  let added = 0;
  let removed = 0;
  for (const p of parts) {
    const words = p.value.trim() ? p.value.trim().split(/\s+/).length : 0;
    if (p.type === "add") added += words;
    else if (p.type === "del") removed += words;
  }
  return { added, removed };
}

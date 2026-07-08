/**
 * Small, dependency-free helpers for the forged-prompt UI: a rough token
 * estimate, export formatting, and a clipboard write. Deliberately no tokenizer
 * dependency — a ~4-chars/token heuristic is plenty for a display badge.
 */

export function estimateTokens(text: string): number {
  if (!text) return 0;
  // ~4 chars per token is the standard rough English heuristic. Blend with a
  // word count so very short / punctuation-heavy strings don't read as 0.
  const byChars = text.length / 4;
  const byWords = text.trim().split(/\s+/).filter(Boolean).length * 1.3;
  return Math.max(1, Math.round((byChars + byWords) / 2));
}

export type ExportFormat = "text" | "markdown" | "json";

export function formatForExport(
  blade: string,
  format: ExportFormat,
  meta?: { ore?: string; opts?: Record<string, string> },
): string {
  switch (format) {
    case "markdown":
      return [
        "# Forged Prompt",
        "",
        blade,
        meta?.ore ? `\n---\n\n_Original idea: ${meta.ore}_` : "",
      ]
        .filter(Boolean)
        .join("\n");
    case "json":
      return JSON.stringify(
        {
          prompt: blade,
          ...(meta?.ore ? { source: meta.ore } : {}),
          ...(meta?.opts ? { options: meta.opts } : {}),
        },
        null,
        2,
      );
    default:
      return blade;
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy path
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Prompt Forge eval harness.
 *
 *   bun run eval                 # standard forge, few-shot ON (production default)
 *   bun run eval --deep          # Deep Forge (draft → reflect) path
 *   bun run eval --no-fewshot    # ablate the exemplar block (A/B its value)
 *   bun run eval --filter enh    # only run cases whose id includes "enh"
 *   bun run eval --limit 3       # first N cases (quick smoke test)
 *
 * Forges every case via the REAL production path (lib/forge-prompt), judges each
 * with an LLM-as-judge rubric, prints per-case + aggregate scores, and writes a
 * timestamped JSON report to eval/reports/. Runs with bounded concurrency.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { forgeText } from "@/lib/forge-prompt";
import { DATASET, type EvalCase } from "./dataset";
import { AXES, judge, overall, type Verdict } from "./judge";

type Flags = {
  deep: boolean;
  fewshot: boolean;
  filter?: string;
  limit?: number;
};

function parseFlags(argv: string[]): Flags {
  const f: Flags = { deep: false, fewshot: true };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--deep") f.deep = true;
    else if (a === "--no-fewshot") f.fewshot = false;
    else if (a === "--filter") f.filter = argv[++i];
    else if (a === "--limit") f.limit = Number(argv[++i]);
  }
  return f;
}

type Row = {
  id: string;
  mode: string;
  verdict: Verdict;
  overall: number;
  forged: string;
  error?: string;
};

// Bounded concurrency so we don't hammer the API / hit rate limits.
async function mapPool<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, i: number) => Promise<R>,
): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i], i);
      }
    },
  );
  await Promise.all(workers);
  return out;
}

const pad = (s: string, n: number) =>
  s.length > n ? `${s.slice(0, n - 1)}…` : s.padEnd(n);
const fmt = (n: number) => n.toFixed(2);

async function runCase(c: EvalCase, flags: Flags): Promise<Row> {
  try {
    const forged = await forgeText(c.ore, c.opts, flags.deep, flags.fewshot);
    const verdict = await judge(c, forged);
    return {
      id: c.id,
      mode: c.mode,
      verdict,
      overall: overall(verdict),
      forged,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      id: c.id,
      mode: c.mode,
      verdict: {
        intentFidelity: 0,
        specificityGain: 0,
        structure: 0,
        formatCompliance: 0,
        didNotAnswer: 0,
        rationale: `ERROR: ${msg}`,
      } as unknown as Verdict,
      overall: 0,
      forged: "",
      error: msg,
    };
  }
}

async function main() {
  const flags = parseFlags(process.argv.slice(2));

  let cases = DATASET;
  if (flags.filter) cases = cases.filter((c) => c.id.includes(flags.filter!));
  if (flags.limit) cases = cases.slice(0, flags.limit);

  const cfg = `deep=${flags.deep} fewshot=${flags.fewshot} model=${
    process.env.OPENROUTER_MODEL ?? "anthropic/claude-3.5-sonnet"
  }`;
  console.log(`\n⚒  Prompt Forge eval — ${cases.length} cases — ${cfg}\n`);

  const rows = await mapPool(cases, 4, (c) => runCase(c, flags));

  // ── Per-case table ──
  console.log(
    `${pad("id", 18)}${pad("mode", 10)}${AXES.map((a) => pad(a.slice(0, 5), 7)).join("")}${pad("OVR", 6)}`,
  );
  console.log("─".repeat(18 + 10 + AXES.length * 7 + 6));
  for (const r of rows) {
    const axisCols = AXES.map((a) => pad(String(r.verdict[a]), 7)).join("");
    const flag = r.error ? " ✗" : r.overall >= 4 ? " ✓" : "";
    console.log(
      `${pad(r.id, 18)}${pad(r.mode, 10)}${axisCols}${pad(fmt(r.overall), 6)}${flag}`,
    );
  }

  // ── Aggregates ──
  const ok = rows.filter((r) => !r.error);
  const mean = (xs: number[]) =>
    xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
  const axisMeans = Object.fromEntries(
    AXES.map((a) => [a, mean(ok.map((r) => r.verdict[a]))]),
  ) as Record<(typeof AXES)[number], number>;
  const overallMean = mean(ok.map((r) => r.overall));

  console.log(`\n── Aggregate (${ok.length}/${rows.length} scored) ──`);
  for (const a of AXES) console.log(`  ${pad(a, 18)} ${fmt(axisMeans[a])}`);
  console.log(`  ${pad("OVERALL", 18)} ${fmt(overallMean)}`);

  // Anti-answer gate: any adversarial case that got answered is a hard failure.
  const breaches = rows.filter(
    (r) => r.verdict.didNotAnswer > 0 && r.verdict.didNotAnswer <= 2,
  );
  if (breaches.length)
    console.log(
      `\n⚠  Prime-Directive breaches (didNotAnswer ≤ 2): ${breaches.map((b) => b.id).join(", ")}`,
    );
  if (rows.some((r) => r.error))
    console.log(
      `\n✗  Errored: ${rows
        .filter((r) => r.error)
        .map((r) => r.id)
        .join(", ")}`,
    );

  // ── Persist report ──
  const dir = join(process.cwd(), "eval", "reports");
  await mkdir(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const file = join(
    dir,
    `${stamp}_deep-${flags.deep}_fewshot-${flags.fewshot}.json`,
  );
  await writeFile(
    file,
    JSON.stringify(
      {
        config: { ...flags, model: process.env.OPENROUTER_MODEL },
        axisMeans,
        overallMean,
        rows,
      },
      null,
      2,
    ),
  );
  console.log(`\n📄 Report: ${file}\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

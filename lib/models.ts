import "server-only";

// OpenRouter model catalog, filtered to the free tier only (per product
// decision: free models first). We fetch the public /models endpoint, keep
// the entries whose prompt+completion price is zero, and normalise each into
// a compact shape the client picker renders. Results are cached in-process
// with a short TTL so the picker doesn't hammer OpenRouter on every request.

const MODELS_URL = "https://openrouter.ai/api/v1/models";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export type FreeModel = {
  id: string; // OpenRouter id, e.g. "qwen/qwen3-coder:free"
  name: string; // human label, e.g. "Qwen: Qwen3 Coder (free)"
  provider: string; // vendor slug from the id, e.g. "qwen"
  description: string; // short blurb (trimmed)
  contextLength: number; // max context window in tokens
  modalities: string[]; // input modalities, e.g. ["text", "image"]
};

type OpenRouterModel = {
  id: string;
  name?: string;
  description?: string;
  context_length?: number;
  pricing?: { prompt?: string; completion?: string };
  architecture?: { input_modalities?: string[] };
};

// A model is "free" when OpenRouter prices both prompt and completion at 0.
// The `:free` id suffix is the convention, but we check price too so a
// paid model mislabelled upstream can never slip through.
function isFree(m: OpenRouterModel): boolean {
  const prompt = Number(m.pricing?.prompt ?? "1");
  const completion = Number(m.pricing?.completion ?? "1");
  return prompt === 0 && completion === 0;
}

function toFreeModel(m: OpenRouterModel): FreeModel {
  const desc = (m.description ?? "").trim();
  return {
    id: m.id,
    name: m.name ?? m.id,
    provider: m.id.split("/")[0] ?? "other",
    // First sentence / ~120 chars keeps the picker rows tidy.
    description: desc.length > 140 ? `${desc.slice(0, 137).trimEnd()}…` : desc,
    contextLength: m.context_length ?? 0,
    modalities: m.architecture?.input_modalities ?? ["text"],
  };
}

let cache: { at: number; models: FreeModel[] } | null = null;
let inflight: Promise<FreeModel[]> | null = null;

async function fetchFreeModels(): Promise<FreeModel[]> {
  const res = await fetch(MODELS_URL, {
    headers: process.env.OPENROUTER_API_KEY
      ? { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` }
      : undefined,
    // Next.js data cache as a second layer; our in-process cache is primary.
    next: { revalidate: 600 },
  });
  if (!res.ok) {
    throw new Error(`OpenRouter models fetch failed: ${res.status}`);
  }
  const json = (await res.json()) as { data: OpenRouterModel[] };
  return json.data
    .filter(isFree)
    .map(toFreeModel)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Cached list of free OpenRouter models. Never throws — returns [] on error. */
export async function getFreeModels(): Promise<FreeModel[]> {
  const now = Date.now();
  if (cache && now - cache.at < CACHE_TTL_MS) return cache.models;
  if (inflight) return inflight;

  inflight = fetchFreeModels()
    .then((models) => {
      cache = { at: Date.now(), models };
      return models;
    })
    .catch(() => cache?.models ?? []) // serve stale on error, else empty
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

/** True when `id` is a currently-known free model — the server's allow-list. */
export async function isFreeModelId(id: string): Promise<boolean> {
  const models = await getFreeModels();
  return models.some((m) => m.id === id);
}

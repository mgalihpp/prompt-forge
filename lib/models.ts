import "server-only";

// OpenRouter model catalog for the composer's picker. Two tiers:
//   - "free": every model OpenRouter prices at $0 prompt+completion.
//   - "pro":  a small curated allow-list of paid models (below). Curated, not
//             "all paid models", to bound OpenRouter spend and keep the picker
//             sane. Both tiers are normalised from the same public /models
//             response and cached in-process with a short TTL.

const MODELS_URL = "https://openrouter.ai/api/v1/models";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// Curated paid models unlocked by Pro. Verified present in the live catalog.
// Adding an id here is the only step to surface a new premium model.
const PRO_MODEL_IDS = new Set([
  "anthropic/claude-sonnet-4.5",
  "anthropic/claude-opus-4.1",
  "anthropic/claude-haiku-4.5",
  "openai/gpt-4o",
  "openai/gpt-4o-mini",
  "openai/gpt-4.1",
  "google/gemini-2.5-pro",
  "google/gemini-2.5-flash",
  "deepseek/deepseek-chat",
  "moonshotai/kimi-k2",
]);

export type ChatModel = {
  id: string; // OpenRouter id, e.g. "qwen/qwen3-coder:free"
  name: string; // human label, e.g. "Qwen: Qwen3 Coder (free)"
  provider: string; // vendor slug from the id, e.g. "qwen"
  description: string; // short blurb (trimmed)
  contextLength: number; // max context window in tokens
  modalities: string[]; // input modalities, e.g. ["text", "image"]
  tier: "free" | "pro"; // gate: pro models require an active Pro plan
};

/** @deprecated use ChatModel — kept so existing importers don't break. */
export type FreeModel = ChatModel;

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

function toChatModel(m: OpenRouterModel, tier: "free" | "pro"): ChatModel {
  const desc = (m.description ?? "").trim();
  return {
    id: m.id,
    name: m.name ?? m.id,
    provider: m.id.split("/")[0] ?? "other",
    // First sentence / ~120 chars keeps the picker rows tidy.
    description: desc.length > 140 ? `${desc.slice(0, 137).trimEnd()}…` : desc,
    contextLength: m.context_length ?? 0,
    modalities: m.architecture?.input_modalities ?? ["text"],
    tier,
  };
}

let cache: { at: number; models: ChatModel[] } | null = null;
let inflight: Promise<ChatModel[]> | null = null;

async function fetchCatalog(): Promise<ChatModel[]> {
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
  const models: ChatModel[] = [];
  for (const m of json.data) {
    if (isFree(m)) models.push(toChatModel(m, "free"));
    else if (PRO_MODEL_IDS.has(m.id)) models.push(toChatModel(m, "pro"));
  }
  // Free first, then pro; alphabetical within each tier.
  return models.sort((a, b) =>
    a.tier === b.tier
      ? a.name.localeCompare(b.name)
      : a.tier === "free"
        ? -1
        : 1,
  );
}

/** Cached model catalog (free + curated pro). Never throws — [] on error. */
export async function getModels(): Promise<ChatModel[]> {
  const now = Date.now();
  if (cache && now - cache.at < CACHE_TTL_MS) return cache.models;
  if (inflight) return inflight;

  inflight = fetchCatalog()
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

/** Just the free tier — kept for any consumer that only wants free models. */
export async function getFreeModels(): Promise<ChatModel[]> {
  return (await getModels()).filter((m) => m.tier === "free");
}

/**
 * Whether `id` may be used by a request. Free ids are always allowed; pro ids
 * require Pro; anything else is unknown (caller falls back to the default).
 */
export async function isAllowedModelId(
  id: string,
  isPro: boolean,
): Promise<"ok" | "pro-required" | "unknown"> {
  const model = (await getModels()).find((m) => m.id === id);
  if (!model) return "unknown";
  if (model.tier === "free") return "ok";
  return isPro ? "ok" : "pro-required";
}

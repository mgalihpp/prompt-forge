import { cn } from "@/lib/utils";

// Maps an OpenRouter provider slug (the part before "/" in a model id) to the
// LobeHub icon-static-png slug. Only entries that differ from the OpenRouter
// slug need listing; anything else is tried as-is and falls back to a
// monogram when the CDN has no matching logo.
const LOBE_SLUG: Record<string, string> = {
  "meta-llama": "meta",
  moonshotai: "moonshot",
  mistralai: "mistral",
  nousresearch: "nousresearch",
  cognitivecomputations: "dolphin",
  "z-ai": "zai",
};

// Providers we know LobeHub publishes a logo for. Keeps us from emitting a
// broken <img> (and a console 404) for slugs with no brand asset.
const KNOWN = new Set([
  "openai",
  "google",
  "qwen",
  "nvidia",
  "cohere",
  "tencent",
  "meta",
  "nousresearch",
  "poolside",
  "moonshot",
  "mistral",
  "dolphin",
  "deepseek",
  "microsoft",
  "xai",
  "zhipu",
  "zai",
  "minimax",
  "bytedance",
  "huggingface",
  "liquid",
  "anthropic",
]);

function lobeSlug(provider: string): string | null {
  const slug = LOBE_SLUG[provider] ?? provider;
  return KNOWN.has(slug) ? slug : null;
}

const CDN = "https://unpkg.com/@lobehub/icons-static-png@latest";

// Two-letter provider monogram — the fallback glyph when there's no logo.
export function monogram(provider: string): string {
  const clean = provider.replace(/[^a-z0-9]/gi, "");
  return (clean.slice(0, 2) || "AI").toUpperCase();
}

/**
 * Brand logo for a model provider, sourced from LobeHub's static PNG CDN
 * (no runtime dependency — just an <img>). LobeHub ships monochrome light/
 * dark variants, so we render both and let CSS pick per theme. Providers
 * without a published logo fall back to a two-letter monogram.
 */
export function ProviderIcon({
  provider,
  className,
}: {
  provider: string;
  className?: string;
}) {
  const slug = lobeSlug(provider);

  if (!slug) {
    return (
      <span
        className={cn(
          "flex items-center justify-center text-[10px] font-semibold text-muted-foreground",
          className,
        )}
        aria-hidden
      >
        {monogram(provider)}
      </span>
    );
  }

  return (
    <span className={cn("relative block", className)} aria-hidden>
      {/* Plain <img>: next/image can't optimize these — unpkg answers with a
          302 redirect the optimizer rejects, and at ~16px there's nothing to
          optimize anyway. */}
      {/* dark-glyph logo for light theme */}
      {/* biome-ignore lint/performance/noImgElement: tiny CDN brand icon behind a redirect */}
      <img
        src={`${CDN}/light/${slug}.png`}
        alt=""
        loading="lazy"
        className="size-full object-contain dark:hidden"
      />
      {/* light-glyph logo for dark theme */}
      {/* biome-ignore lint/performance/noImgElement: tiny CDN brand icon behind a redirect */}
      <img
        src={`${CDN}/dark/${slug}.png`}
        alt=""
        loading="lazy"
        className="hidden size-full object-contain dark:block"
      />
    </span>
  );
}

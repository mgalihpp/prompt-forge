// Client-safe plan constants — no server imports so UI components can use them.
export type Plan = "free" | "pro";

export const FREE_DAILY_LIMIT = 10;

export const LIMIT_MESSAGE = "Daily limit reached — resets at midnight UTC.";

// Pro-gate rejection bodies. The chat route returns these as the response body;
// error-notice.tsx string-matches them to render an upgrade prompt.
export const DEEP_FORGE_PRO_MESSAGE =
  "Deep Forge is a Pro feature — upgrade to unlock it.";
export const PRO_MODEL_MESSAGE = "That model requires Pro.";

export const PRO_FEATURES = [
  "Unlimited prompts per day",
  "Premium models (Claude, GPT-4o, and more)",
  "Deep Forge multi-variant refinement",
  "Early access to new features",
];

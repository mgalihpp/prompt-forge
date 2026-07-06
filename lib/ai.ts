import { createOpenRouter } from "@openrouter/ai-sdk-provider";

// OpenRouter via Vercel AI SDK. Model overridable through env.
export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const chatModel = openrouter(
  process.env.OPENROUTER_MODEL ?? "anthropic/claude-3.5-sonnet",
);

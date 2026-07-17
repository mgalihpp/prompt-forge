import { createOpenRouter } from "@openrouter/ai-sdk-provider";

// OpenRouter via Vercel AI SDK. Model overridable through env.
export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const DEFAULT_MODEL =
  process.env.OPENROUTER_MODEL ?? "anthropic/claude-3.5-sonnet";

export const chatModel = openrouter(DEFAULT_MODEL);

// Resolve a user-selected model id into an AI SDK model. Callers must have
// already validated `id` against the free allow-list (see lib/models.ts);
// a nullish id falls back to the configured default.
export function resolveModel(id: string | null | undefined) {
  return id ? openrouter(id) : chatModel;
}

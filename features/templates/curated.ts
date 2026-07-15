import type { ForgeOpts } from "@/lib/forge-prompt";

/**
 * Curated template gallery. Each entry seeds the composer with a rough "ore"
 * and a sensible knob configuration, so a user can forge something great in
 * one click and learn the modes by example. Grouped by category on the
 * /templates page; a subset also appears as pills on the chat empty state.
 */
export type TemplateCategory = "Writing" | "Coding" | "Marketing" | "Learning";

export type CuratedTemplate = {
  id: string;
  label: string;
  emoji: string;
  ore: string;
  opts: ForgeOpts;
  deepForge?: boolean;
  category: TemplateCategory;
};

export const CATEGORIES: readonly TemplateCategory[] = [
  "Writing",
  "Coding",
  "Marketing",
  "Learning",
];

export const CURATED_TEMPLATES: CuratedTemplate[] = [
  // ── Writing ─────────────────────────────────────────────────────────────
  {
    id: "blog",
    label: "Blog post",
    emoji: "✍️",
    category: "Writing",
    ore: "write a blog post about a topic I care about",
    opts: {
      mode: "Enhance",
      persona: "Marketer",
      tone: "Friendly",
      format: "Markdown",
      target: "Generic",
    },
  },
  {
    id: "email",
    label: "Tidy an email",
    emoji: "✉️",
    category: "Writing",
    ore: "clean up this rambling email so it's short and professional",
    opts: {
      mode: "Summarize",
      persona: "Neutral",
      tone: "Professional",
      format: "Plain",
      target: "Generic",
    },
  },
  {
    id: "meeting",
    label: "Meeting summary",
    emoji: "📋",
    category: "Writing",
    ore: "turn these messy meeting notes into a clear summary with action items",
    opts: {
      mode: "Summarize",
      persona: "Neutral",
      tone: "Professional",
      format: "Bullet points",
      target: "Generic",
    },
  },
  // ── Coding ──────────────────────────────────────────────────────────────
  {
    id: "coding",
    label: "Coding task",
    emoji: "💻",
    category: "Coding",
    ore: "help me build a feature in my app",
    opts: {
      mode: "Rewrite",
      persona: "Expert",
      tone: "Professional",
      format: "Markdown",
      target: "Claude",
    },
  },
  {
    id: "agent",
    label: "System prompt",
    emoji: "🤖",
    category: "Coding",
    ore: "a system prompt that makes an AI act as a specialized assistant",
    opts: {
      mode: "Expand",
      persona: "Expert",
      tone: "Formal",
      format: "Markdown",
      target: "Claude",
    },
    deepForge: true,
  },
  {
    id: "code-review",
    label: "Code review",
    emoji: "🔍",
    category: "Coding",
    ore: "review my code for bugs, readability, and performance issues",
    opts: {
      mode: "Enhance",
      persona: "Expert",
      tone: "Professional",
      format: "Markdown",
      target: "Claude",
    },
  },
  {
    id: "query-helper",
    label: "Regex / SQL helper",
    emoji: "🧩",
    category: "Coding",
    ore: "write a regex or SQL query that does what I describe, with an explanation",
    opts: {
      mode: "Rewrite",
      persona: "Expert",
      tone: "Professional",
      format: "Markdown",
      target: "ChatGPT",
    },
  },
  // ── Marketing ───────────────────────────────────────────────────────────
  {
    id: "idea",
    label: "Flesh out an idea",
    emoji: "🚀",
    category: "Marketing",
    ore: "a one-line product idea I want to expand into a full spec",
    opts: {
      mode: "Expand",
      persona: "Expert",
      tone: "Professional",
      format: "Markdown",
      target: "ChatGPT",
    },
    deepForge: true,
  },
  {
    id: "landing",
    label: "Landing page copy",
    emoji: "🖼️",
    category: "Marketing",
    ore: "write landing page copy for my product: headline, subheadline, and benefits",
    opts: {
      mode: "Expand",
      persona: "Marketer",
      tone: "Casual",
      format: "Markdown",
      target: "Generic",
    },
  },
  {
    id: "social",
    label: "Social post",
    emoji: "📣",
    category: "Marketing",
    ore: "turn this announcement into a short, punchy social media post",
    opts: {
      mode: "Rewrite",
      persona: "Marketer",
      tone: "Casual",
      format: "Plain",
      target: "Generic",
    },
  },
  // ── Learning ────────────────────────────────────────────────────────────
  {
    id: "study",
    label: "Study helper",
    emoji: "📚",
    category: "Learning",
    ore: "help me understand a hard concept and quiz me on it",
    opts: {
      mode: "Enhance",
      persona: "Teacher",
      tone: "Friendly",
      format: "Bullet points",
      target: "Generic",
    },
  },
  {
    id: "eli5",
    label: "Explain like I'm five",
    emoji: "🧸",
    category: "Learning",
    ore: "explain this complex topic in simple terms with everyday analogies",
    opts: {
      mode: "Rewrite",
      persona: "Teacher",
      tone: "Casual",
      format: "Plain",
      target: "Generic",
    },
  },
];

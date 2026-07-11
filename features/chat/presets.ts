import type { ForgeOpts } from "@/lib/forge-prompt";

/**
 * Starter presets shown on the empty state. Each seeds the composer with a
 * rough "ore" and a sensible knob configuration, so a new user can forge
 * something great in one click and learn the modes by example.
 */
export type Preset = {
  id: string;
  label: string;
  emoji: string;
  ore: string;
  opts: ForgeOpts;
  deepForge?: boolean;
};

export const PRESETS: Preset[] = [
  {
    id: "blog",
    label: "Blog post",
    emoji: "✍️",
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
    id: "coding",
    label: "Coding task",
    emoji: "💻",
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
    id: "email",
    label: "Tidy an email",
    emoji: "✉️",
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
    id: "idea",
    label: "Flesh out an idea",
    emoji: "🚀",
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
    id: "agent",
    label: "System prompt",
    emoji: "🤖",
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
    id: "study",
    label: "Study helper",
    emoji: "📚",
    ore: "help me understand a hard concept and quiz me on it",
    opts: {
      mode: "Enhance",
      persona: "Teacher",
      tone: "Friendly",
      format: "Bullet points",
      target: "Generic",
    },
  },
];

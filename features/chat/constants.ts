import {
  Wand2,
  UserRound,
  Palette,
  FileText,
  Target,
  type LucideIcon,
} from "lucide-react"


export const OPTIONS: Record<
  string,
  { icon: LucideIcon; values: readonly string[] }
> = {
  mode: { icon: Wand2, values: ["Enhance", "Rewrite", "Summarize", "Expand"] },
  persona: {
    icon: UserRound,
    values: ["Neutral", "Expert", "Teacher", "Marketer"],
  },
  tone: {
    icon: Palette,
    values: ["Professional", "Casual", "Friendly", "Formal"],
  },
  format: {
    icon: FileText,
    values: ["Plain", "Markdown", "Bullet points", "JSON"],
  },
  target: {
    icon: Target,
    values: ["ChatGPT", "Claude", "Gemini", "Generic"],
  },
}

export const defaultOptions = (): Record<string, string> =>
  Object.fromEntries(Object.entries(OPTIONS).map(([k, v]) => [k, v.values[0]]))

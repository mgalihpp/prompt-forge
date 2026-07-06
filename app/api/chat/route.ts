import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { chatModel } from "@/lib/ai";

export const maxDuration = 60;

type Body = {
  messages: UIMessage[];
  opts?: Record<string, string>;
  deepForge?: boolean;
};

function systemPrompt(opts: Record<string, string> = {}, deepForge = false) {
  const { mode, persona, tone, format, target } = opts;
  const lines = [
    "You are Prompt Forge, an expert prompt engineer. Rewrite the user's input into a high-quality prompt.",
    mode && `Mode: ${mode}.`,
    persona && `Adopt the persona of a ${persona}.`,
    tone && `Tone: ${tone}.`,
    format && `Output format: ${format}.`,
    target && `Optimize the prompt for the ${target} model.`,
    deepForge &&
      "Deep Forge is ON: reason step-by-step, add context, constraints, and examples to maximize output quality.",
    "Return only the enhanced prompt, no preamble.",
  ];
  return lines.filter(Boolean).join(" ");
}

export async function POST(req: Request) {
  const { messages, opts, deepForge }: Body = await req.json();

  const result = streamText({
    model: chatModel,
    system: systemPrompt(opts, deepForge),
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}

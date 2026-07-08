import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  generateText,
  type ModelMessage,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { chatModel } from "@/lib/ai";
import { reflectSystemPrompt, systemPrompt } from "@/lib/forge-prompt";

export const maxDuration = 60;

type Body = {
  messages: UIMessage[];
  opts?: Record<string, string>;
  deepForge?: boolean;
};

export async function POST(req: Request) {
  const { messages, opts, deepForge }: Body = await req.json();

  const system = systemPrompt(opts, deepForge);
  const modelMessages = await convertToModelMessages(messages);

  // Standard heat: one streamed forge. Fast path, streaming UX preserved.
  if (!deepForge) {
    const result = streamText({
      model: chatModel,
      system,
      messages: modelMessages,
    });
    return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream }),
    });
  }

  // Deep Forge: draft silently, then run ONE reflection pass and stream that.
  // Only the final, improved blade reaches the user, so the surface is identical.
  const draft = await generateText({
    model: chatModel,
    system,
    messages: modelMessages,
  });

  const reflectionMessages: ModelMessage[] = [
    ...modelMessages,
    { role: "assistant", content: draft.text },
    {
      role: "user",
      content:
        "That draft is your forged prompt. Run the reflection pass and return only the improved prompt.",
    },
  ];

  const result = streamText({
    model: chatModel,
    system: reflectSystemPrompt(system),
    messages: reflectionMessages,
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}

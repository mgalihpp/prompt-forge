import { useChat } from "@ai-sdk/react";
import { useMemo } from "react";
import { chat } from "../chat-instance";
import { useForgyState } from "../hooks/use-forgy-state";
import { collectText } from "./collect-text";
import { EmptyState } from "./empty-state";
import { ErrorNotice } from "./error-notice";
import { MessageRow } from "./message-row";
import { TypingIndicator } from "./typing-indicator";

export function MessageList() {
  const { messages, status, error, regenerate } = useChat({ chat });

  const waiting = status === "submitted";
  const forgyState = useForgyState(status, Boolean(error));
  const lastAssistantId = useMemo(
    () =>
      waiting
        ? undefined
        : [...messages].reverse().find((m) => m.role === "assistant")?.id,
    [messages, waiting],
  );

  const isStreaming = status === "streaming";

  if (messages.length === 0 && !waiting) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col py-8">
      <div className="flex w-full flex-col gap-5">
        {messages.map((message, i) => {
          // The ore for an assistant turn is the nearest preceding user message.
          const ore =
            message.role === "assistant"
              ? [...messages.slice(0, i)]
                  .reverse()
                  .find((m) => m.role === "user")
              : undefined;
          return (
            <MessageRow
              key={message.id}
              text={collectText(message, "text")}
              reasoning={collectText(message, "reasoning")}
              ore={ore ? collectText(ore, "text") : ""}
              role={message.role}
              isLastAssistant={message.id === lastAssistantId}
              streaming={isStreaming}
              forgyState={forgyState}
              onRegenerate={
                message.id === lastAssistantId ? () => regenerate() : undefined
              }
            />
          );
        })}

        {waiting && <TypingIndicator />}
        {error && <ErrorNotice onRetry={() => regenerate()} />}
      </div>
    </div>
  );
}

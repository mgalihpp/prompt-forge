import { useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { chat } from "../chat-instance";
import { useForgyState } from "../hooks/use-forgy-state";
import { collectText } from "./collect-text";
import { EmptyState } from "./empty-state";
import { MessageRow } from "./message-row";
import { TypingIndicator } from "./typing-indicator";
import { ErrorNotice } from "./error-notice";

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
        {messages.map((message) => (
          <MessageRow
            key={message.id}
            text={collectText(message, "text")}
            reasoning={collectText(message, "reasoning")}
            role={message.role}
            isLastAssistant={message.id === lastAssistantId}
            streaming={isStreaming}
            forgyState={forgyState}
          />
        ))}

        {waiting && <TypingIndicator />}
        {error && <ErrorNotice onRetry={() => regenerate()} />}
      </div>
    </div>
  );
}

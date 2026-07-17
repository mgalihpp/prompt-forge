import { useChat } from "@ai-sdk/react";
import { useEffect, useMemo } from "react";
import { LIMIT_MESSAGE } from "@/lib/plans";
import { chat } from "../chat-instance";
import { useForgyState } from "../hooks/use-forgy-state";
import { useChatStore } from "../store";
import { useUpgradeDialog } from "../upgrade-dialog-store";
import { collectText } from "./collect-text";
import { EmptyState } from "./empty-state";
import { ErrorNotice } from "./error-notice";
import { MessageRow } from "./message-row";
import { TypingIndicator } from "./typing-indicator";

export function MessageList() {
  const { messages, status, error, regenerate } = useChat({ chat });
  const openUpgrade = useUpgradeDialog((s) => s.setOpen);

  // Server 429 fallback: if a send slipped past the composer's pre-check and
  // hit the daily limit, surface the upgrade dialog.
  useEffect(() => {
    if (error?.message.includes(LIMIT_MESSAGE)) openUpgrade(true);
  }, [error, openUpgrade]);

  // Regenerate must carry the same body as a fresh send, or deep forge
  // silently downgrades to a standard forge.
  const regenerateWithBody = () => {
    const { opts, deepForge, threadId } = useChatStore.getState();
    regenerate({ body: { opts, deepForge, threadId, mode: "regenerate" } });
  };

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
            <div key={message.id} className="group/msg relative">
              <MessageRow
                message={message}
                text={collectText(message, "text")}
                reasoning={collectText(message, "reasoning")}
                ore={ore ? collectText(ore, "text") : ""}
                role={message.role}
                isLastAssistant={message.id === lastAssistantId}
                streaming={isStreaming}
                forgyState={forgyState}
                onRegenerate={
                  message.id === lastAssistantId
                    ? regenerateWithBody
                    : undefined
                }
              />
            </div>
          );
        })}

        {waiting && <TypingIndicator />}
        {error && <ErrorNotice error={error} onRetry={regenerateWithBody} />}
      </div>
    </div>
  );
}

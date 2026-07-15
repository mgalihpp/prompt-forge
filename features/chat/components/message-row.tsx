import type { UIMessage } from "ai";
import { memo } from "react";
import { AssistantTurn } from "./assistant-turn";
import type { ForgyState } from "./forgy";
import { UserBubble } from "./user-bubble";

export const MessageRow = memo(
  function MessageRow({
    message,
    text,
    reasoning,
    ore,
    role,
    isLastAssistant,
    streaming,
    forgyState,
    onRegenerate,
  }: {
    message: UIMessage;
    text: string;
    reasoning: string;
    ore: string;
    role: string;
    isLastAssistant: boolean;
    streaming: boolean;
    forgyState: ForgyState;
    onRegenerate?: () => void;
  }) {
    if (role === "user") {
      return <UserBubble messageId={message.id} text={text} />;
    }

    return (
      <AssistantTurn
        message={message}
        text={text}
        reasoning={reasoning}
        ore={ore}
        streaming={streaming && isLastAssistant}
        isLastAssistant={isLastAssistant}
        forgyState={isLastAssistant ? forgyState : undefined}
        onRegenerate={onRegenerate}
      />
    );
  },
  (prev, next) => {
    // The AI SDK replaces the message object on every stream write, so
    // reference equality is a correct change signal for the data parts.
    if (prev.message !== next.message) return false;
    if (prev.text !== next.text) return false;
    if (prev.reasoning !== next.reasoning) return false;
    if (prev.ore !== next.ore) return false;
    if (prev.role !== next.role) return false;
    if (prev.isLastAssistant !== next.isLastAssistant) return false;
    if (prev.streaming !== next.streaming) return false;
    if (prev.forgyState !== next.forgyState) return false;
    if (prev.onRegenerate !== next.onRegenerate) return false;
    return true;
  },
);

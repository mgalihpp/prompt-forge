import { memo } from "react";
import { AssistantTurn } from "./assistant-turn";
import type { ForgyState } from "./forgy";
import { UserBubble } from "./user-bubble";

export const MessageRow = memo(
  function MessageRow({
    text,
    reasoning,
    ore,
    role,
    isLastAssistant,
    streaming,
    forgyState,
    onRegenerate,
  }: {
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
      return <UserBubble text={text} />;
    }

    return (
      <AssistantTurn
        text={text}
        reasoning={reasoning}
        ore={ore}
        streaming={streaming && isLastAssistant}
        forgyState={isLastAssistant ? forgyState : undefined}
        onRegenerate={onRegenerate}
      />
    );
  },
  (prev, next) => {
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

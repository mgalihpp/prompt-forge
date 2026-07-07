import { memo } from "react";
import type { ForgyState } from "./forgy";
import { UserBubble } from "./user-bubble";
import { AssistantTurn } from "./assistant-turn";

export const MessageRow = memo(
  function MessageRow({
    text,
    reasoning,
    role,
    isLastAssistant,
    streaming,
    forgyState,
  }: {
    text: string;
    reasoning: string;
    role: string;
    isLastAssistant: boolean;
    streaming: boolean;
    forgyState: ForgyState;
  }) {
    if (role === "user") {
      return <UserBubble text={text} />;
    }

    return (
      <AssistantTurn
        text={text}
        reasoning={reasoning}
        streaming={streaming && isLastAssistant}
        forgyState={isLastAssistant ? forgyState : undefined}
      />
    );
  },
  (prev, next) => {
    if (prev.text !== next.text) return false;
    if (prev.reasoning !== next.reasoning) return false;
    if (prev.role !== next.role) return false;
    if (prev.isLastAssistant !== next.isLastAssistant) return false;
    if (prev.streaming !== next.streaming) return false;
    if (prev.forgyState !== next.forgyState) return false;
    return true;
  },
);

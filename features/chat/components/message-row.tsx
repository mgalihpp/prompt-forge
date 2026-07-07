import { memo, useMemo } from "react";
import type { UIMessage } from "ai";
import type { ForgyState } from "./forgy";
import { collectText } from "./collect-text";
import { UserBubble } from "./user-bubble";
import { AssistantTurn } from "./assistant-turn";

export const MessageRow = memo(function MessageRow({
  message,
  isLastAssistant,
  streaming,
  forgyState,
}: {
  message: UIMessage;
  isLastAssistant: boolean;
  streaming: boolean;
  forgyState: ForgyState;
}) {
  const text = useMemo(() => collectText(message, "text"), [message]);
  const reasoning = useMemo(
    () => collectText(message, "reasoning"),
    [message],
  );

  if (message.role === "user") {
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
});

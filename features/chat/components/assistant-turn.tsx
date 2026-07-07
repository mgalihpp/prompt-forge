import { memo } from "react";
import { Message, MessageContent } from "@/components/ui/message";
import { AssistantMessage } from "./assistant-message";
import type { ForgyState } from "./forgy";
import { ForgyMascot } from "./forgy-mascot";

export const AssistantTurn = memo(function AssistantTurn({
  text,
  reasoning,
  streaming,
  forgyState,
}: {
  text: string;
  reasoning: string;
  streaming: boolean;
  forgyState?: ForgyState;
}) {
  return (
    <div>
      <Message align="start" className="max-w-[min(52rem,100%)]">
        <MessageContent className="min-w-0 flex-1 pt-1">
          <AssistantMessage
            text={text}
            reasoning={reasoning}
            streaming={streaming}
          />
        </MessageContent>
      </Message>
      {forgyState && (
        <ForgyMascot state={forgyState} className="my-4 size-12" autoWave />
      )}
    </div>
  );
});

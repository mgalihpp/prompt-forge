import { memo, useState } from "react";
import { Message, MessageContent } from "@/components/ui/message";
import { AssistantMessage } from "./assistant-message";
import { ForgeActions } from "./forge-actions";
import { ForgeDiff } from "./forge-diff";
import type { ForgyState } from "./forgy";
import { ForgyMascot } from "./forgy-mascot";

export const AssistantTurn = memo(
  function AssistantTurn({
    text,
    reasoning,
    ore,
    streaming,
    forgyState,
    onRegenerate,
  }: {
    text: string;
    reasoning: string;
    ore: string;
    streaming: boolean;
    forgyState?: ForgyState;
    onRegenerate?: () => void;
  }) {
    const [showDiff, setShowDiff] = useState(false);
    const showActions = !streaming && text.trim().length > 0;

    return (
      <div>
        <Message align="start" className="max-w-[min(52rem,100%)]">
          <MessageContent className="min-w-0 flex-1 pt-1">
            <AssistantMessage
              text={text}
              reasoning={reasoning}
              streaming={streaming}
            />
            {showActions && (
              <>
                <ForgeActions
                  blade={text}
                  ore={ore}
                  showDiff={showDiff}
                  onToggleDiff={() => setShowDiff((v) => !v)}
                  onRegenerate={onRegenerate}
                />
                {showDiff && ore && (
                  <div className="mt-2">
                    <ForgeDiff ore={ore} blade={text} />
                  </div>
                )}
              </>
            )}
          </MessageContent>
        </Message>
        {forgyState && (
          <ForgyMascot state={forgyState} className="my-4 size-12" autoWave />
        )}
      </div>
    );
  },
  (prev, next) => {
    if (prev.text !== next.text) return false;
    if (prev.reasoning !== next.reasoning) return false;
    if (prev.ore !== next.ore) return false;
    if (prev.streaming !== next.streaming) return false;
    if (prev.forgyState !== next.forgyState) return false;
    if (prev.onRegenerate !== next.onRegenerate) return false;
    return true;
  },
);

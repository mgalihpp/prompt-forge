import type { UIMessage } from "ai";
import { memo, useEffect, useState } from "react";
import { Message, MessageContent } from "@/components/ui/message";
import {
  bestLabel,
  reviewPart,
  type VariantLabel,
  variantParts,
} from "@/lib/deep-forge";
import { AssistantMessage } from "./assistant-message";
import { DeepForgeCard } from "./deep-forge-card";
import { FollowUpChips } from "./follow-up-chips";
import { ForgeActions } from "./forge-actions";
import { ForgeDiff } from "./forge-diff";
import type { ForgyState } from "./forgy";
import { ForgyMascot } from "./forgy-mascot";

export const AssistantTurn = memo(
  function AssistantTurn({
    message,
    text,
    reasoning,
    ore,
    streaming,
    isLastAssistant,
    forgyState,
    onRegenerate,
  }: {
    message: UIMessage;
    text: string;
    reasoning: string;
    ore: string;
    streaming: boolean;
    isLastAssistant: boolean;
    forgyState?: ForgyState;
    onRegenerate?: () => void;
  }) {
    const [showDiff, setShowDiff] = useState(false);

    // Deep Forge turns carry data parts instead of plain text.
    const variants = variantParts(message);
    const isDeep = variants.length > 0;
    const review = reviewPart(message);
    const reviewDone = review?.status === "done";

    const [active, setActive] = useState<VariantLabel>("A");
    const [autoSelected, setAutoSelected] = useState(false);
    // Jump to the best-scored tab once, when judging lands — then leave the
    // user's tab clicks alone.
    useEffect(() => {
      if (reviewDone && !autoSelected) {
        setAutoSelected(true);
        if (review.status === "done") setActive(bestLabel(review));
      }
    }, [reviewDone, autoSelected, review]);

    const activeText = isDeep
      ? (variants.find((v) => v.label === active)?.text ?? "")
      : text;
    const showActions = isDeep
      ? !streaming && variants.some((v) => v.status === "done" && v.text)
      : !streaming && text.trim().length > 0;

    return (
      <div>
        <Message align="start" className="max-w-[min(52rem,100%)]">
          <MessageContent className="min-w-0 flex-1 pt-1">
            {isDeep ? (
              <DeepForgeCard
                variants={variants}
                review={review}
                streaming={streaming}
                active={active}
                onActiveChange={setActive}
              />
            ) : (
              <AssistantMessage
                text={text}
                reasoning={reasoning}
                streaming={streaming}
              />
            )}
            {showActions && (
              <>
                <ForgeActions
                  blade={activeText}
                  ore={ore}
                  showDiff={showDiff}
                  onToggleDiff={() => setShowDiff((v) => !v)}
                  onRegenerate={onRegenerate}
                />
                {showDiff && ore && (
                  <div className="mt-2">
                    <ForgeDiff ore={ore} blade={activeText} />
                  </div>
                )}
                {isLastAssistant && review?.status === "done" && (
                  <FollowUpChips suggestions={review.followUps} />
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
    // The AI SDK replaces the message object on every stream write, so
    // reference equality is a correct change signal for the data parts.
    if (prev.message !== next.message) return false;
    if (prev.text !== next.text) return false;
    if (prev.reasoning !== next.reasoning) return false;
    if (prev.ore !== next.ore) return false;
    if (prev.streaming !== next.streaming) return false;
    if (prev.isLastAssistant !== next.isLastAssistant) return false;
    if (prev.forgyState !== next.forgyState) return false;
    if (prev.onRegenerate !== next.onRegenerate) return false;
    return true;
  },
);

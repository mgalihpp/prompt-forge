import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Message,
  MessageContent,
} from "@/components/ui/message";
import { chat } from "../chat-instance";
import { useForgyState } from "../hooks/use-forgy-state";
import { AssistantMessage } from "./assistant-message";
import type { ForgyState } from "./forgy";
import { ForgyMascot } from "./forgy-mascot";

/** Concatenate every part of a message that matches `kind` into one string. */
function collectText(message: UIMessage, kind: "text" | "reasoning") {
  return message.parts
    .map((part) => {
      // Compare against string literals so TS narrows `part` to a kind that
      // actually has `.text` (the union also holds tool/file/step parts).
      if (part.type === "text" && kind === "text") return part.text;
      if (part.type === "reasoning" && kind === "reasoning") return part.text;
      return "";
    })
    .join("");
}

// ── Presentational pieces ──────────────────────────────────────────────────

/** Hero shown before the first message is sent. */
function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <ForgyMascot state="idle" className="size-24" autoWave />
      <p className="text-2xl font-semibold tracking-tight text-foreground">
        Enhance your prompt
      </p>
      <p className="max-w-md text-sm leading-6 text-muted-foreground">
        Type a rough idea below. Prompt Forge will turn it into a clearer, more
        useful prompt.
      </p>
    </div>
  );
}

/** A user's message, right-aligned with the "You" avatar. */
function UserBubble({ text }: { text: string }) {
  return (
    <Message align="end">
      <MessageContent className="items-end">
        <div className="w-fit max-w-[min(42rem,100%)] rounded-2xl rounded-tr-md border bg-background px-4 py-3 text-foreground shadow-sm">
          {text}
        </div>
      </MessageContent>
    </Message>
  );
}

/**
 * An assistant turn. The Forgy mascot is rendered only for the latest turn —
 * pass `forgyState` to show it, or omit it for older turns.
 */
function AssistantTurn({
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
}

/** Bouncing dots + thinking mascot while the request is in flight. */
function TypingIndicator() {
  return (
    <div>
      <Message align="start" className="max-w-[min(52rem,100%)]">
        <MessageContent className="w-fit rounded-2xl rounded-tl-md border bg-muted/45 px-4 py-3 shadow-sm">
          <span className="flex gap-1.5">
            <span className="size-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
            <span className="size-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
            <span className="size-2 animate-bounce rounded-full bg-muted-foreground/60" />
          </span>
        </MessageContent>
      </Message>
      <ForgyMascot state="thinking" className="mt-4 size-12" />
    </div>
  );
}

/** Inline error banner with a retry action. */
function ErrorNotice({ onRetry }: { onRetry: () => void }) {
  return (
    <div>
      <div className="mx-auto flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
        <span>Something went wrong.</span>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 gap-1.5 text-destructive hover:text-destructive"
          onClick={onRetry}
        >
          <RotateCcw className="size-3.5" />
          Retry
        </Button>
      </div>
    </div>
  );
}

/** Dispatches one message to the right bubble based on its role. */
function MessageRow({
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
  if (message.role === "user") {
    return <UserBubble text={collectText(message, "text")} />;
  }

  return (
    <AssistantTurn
      text={collectText(message, "text")}
      reasoning={collectText(message, "reasoning")}
      streaming={streaming && isLastAssistant}
      forgyState={isLastAssistant ? forgyState : undefined}
    />
  );
}

// ── Container ──────────────────────────────────────────────────────────────

// Shares the same Chat instance as the Composer.
export function MessageList() {
  const { messages, status, error, regenerate } = useChat({ chat });

  // "submitted" = request sent, no tokens yet → show typing bubble.
  const waiting = status === "submitted";

  // Forgy's live expression + which assistant turn should wear it.
  const forgyState = useForgyState(status, Boolean(error));
  const lastAssistantId = waiting
    ? undefined
    : [...messages].reverse().find((m) => m.role === "assistant")?.id;

  if (messages.length === 0 && !waiting) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col py-8">
      <div className="flex w-full flex-col gap-5">
        {messages.map((message) => (
          <MessageRow
            key={message.id}
            message={message}
            isLastAssistant={message.id === lastAssistantId}
            streaming={status === "streaming"}
            forgyState={forgyState}
          />
        ))}

        {waiting && <TypingIndicator />}
        {error && <ErrorNotice onRetry={() => regenerate()} />}
      </div>
    </div>
  );
}

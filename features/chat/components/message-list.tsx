import { useChat } from "@ai-sdk/react";
import { Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteMessages } from "@/lib/hooks/use-history";
import { chat } from "../chat-instance";
import { useForgyState } from "../hooks/use-forgy-state";
import { collectText } from "./collect-text";
import { EmptyState } from "./empty-state";
import { ErrorNotice } from "./error-notice";
import { MessageRow } from "./message-row";
import { TypingIndicator } from "./typing-indicator";

// Messages hydrated from history carry their MongoDB ids; live-streamed ones
// have AI SDK ids. Only persisted messages can be deleted from history.
const isPersistedId = (id: string) => /^[0-9a-f]{24}$/.test(id);

export function MessageList() {
  const { messages, status, error, regenerate } = useChat({ chat });
  const del = useDeleteMessages();
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

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

  const confirmDelete = () => {
    const id = pendingDelete;
    if (!id) return;
    del.mutate(
      { ids: [id] },
      {
        onSuccess: () => {
          chat.messages = chat.messages.filter((m) => m.id !== id);
        },
        onError: () => toast.error("Couldn't delete message"),
      },
    );
    setPendingDelete(null);
  };

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
                text={collectText(message, "text")}
                reasoning={collectText(message, "reasoning")}
                ore={ore ? collectText(ore, "text") : ""}
                role={message.role}
                isLastAssistant={message.id === lastAssistantId}
                streaming={isStreaming}
                forgyState={forgyState}
                onRegenerate={
                  message.id === lastAssistantId
                    ? () => regenerate()
                    : undefined
                }
              />
              {isPersistedId(message.id) && (
                <button
                  type="button"
                  title="Delete message from history"
                  onClick={() => setPendingDelete(message.id)}
                  className="absolute -top-1 right-0 rounded-full p-1.5 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover/msg:opacity-100"
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
            </div>
          );
        })}

        {waiting && <TypingIndicator />}
        {error && <ErrorNotice onRetry={() => regenerate()} />}
      </div>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this message?</AlertDialogTitle>
            <AlertDialogDescription>
              The message will be permanently removed from your chat history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

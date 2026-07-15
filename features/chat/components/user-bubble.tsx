import { Check, Copy, Pencil, X } from "lucide-react";
import { memo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Message, MessageContent } from "@/components/ui/message";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { copyToClipboard } from "@/lib/forge-utils";
import { chat } from "../chat-instance";
import { useChatStore } from "../store";

export const UserBubble = memo(function UserBubble({
  messageId,
  text,
}: {
  messageId: string;
  text: string;
}) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = async () => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const startEdit = () => {
    setDraft(text);
    setEditing(true);
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  };

  const cancelEdit = () => {
    setEditing(false);
    setDraft(text);
  };

  const saveEdit = () => {
    const trimmed = draft.trim();
    if (!trimmed || trimmed === text) {
      setEditing(false);
      return;
    }
    const busy = chat.status === "submitted" || chat.status === "streaming";
    if (busy) return;

    // Body must match a fresh send, or deep forge silently downgrades.
    const { opts, deepForge, threadId } = useChatStore.getState();
    setEditing(false);
    // The SDK truncates everything after this message, swaps in the new
    // text, and submits — the server mirrors the truncation via
    // mode: "regenerate" before persisting the fresh exchange.
    chat.sendMessage(
      { text: trimmed, messageId },
      { body: { opts, deepForge, threadId, mode: "regenerate" } },
    );
  };

  if (editing) {
    return (
      <Message align="end">
        <MessageContent className="items-end">
          <Textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-fit min-w-[min(42rem,100%)] max-w-[min(42rem,100%)] rounded-2xl rounded-tr-md border bg-background px-4 py-3 text-foreground shadow-sm"
          />
          <div className="mt-1 flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 rounded-full"
                    onClick={saveEdit}
                  />
                }
              >
                <Check className="size-3" />
              </TooltipTrigger>
              <TooltipContent>Save</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 rounded-full"
                    onClick={cancelEdit}
                  />
                }
              >
                <X className="size-3" />
              </TooltipTrigger>
              <TooltipContent>Cancel</TooltipContent>
            </Tooltip>
          </div>
        </MessageContent>
      </Message>
    );
  }

  return (
    <Message align="end">
      <MessageContent className="items-end">
        <div className="w-fit max-w-[min(42rem,100%)] rounded-2xl rounded-tr-md border bg-background px-4 py-3 text-foreground shadow-sm">
          {text}
        </div>
        <div className="mt-1 flex items-center gap-1 opacity-0 transition-opacity group-hover/msg:opacity-100">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 rounded-full"
                  onClick={handleCopy}
                />
              }
            >
              {copied ? (
                <Check className="size-3" />
              ) : (
                <Copy className="size-3" />
              )}
            </TooltipTrigger>
            <TooltipContent>Copy</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 rounded-full"
                  onClick={startEdit}
                />
              }
            >
              <Pencil className="size-3" />
            </TooltipTrigger>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>
        </div>
      </MessageContent>
    </Message>
  );
});

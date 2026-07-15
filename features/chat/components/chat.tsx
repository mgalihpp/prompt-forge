"use client";

import { useChat } from "@ai-sdk/react";
import { memo } from "react";
import { chat } from "../chat-instance";
import { useInvalidateUsageOnChat } from "../hooks/use-invalidate-usage";
import { Composer } from "./composer";
import { MessageList } from "./message-list";

const MemoMessageList = memo(MessageList);
const MemoComposer = memo(Composer);

export function Chat() {
  useInvalidateUsageOnChat();

  const { messages, status } = useChat({ chat });
  const isEmpty = messages.length === 0 && status !== "submitted";

  if (isEmpty) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(circle_at_top_left,hsl(var(--muted))_0,transparent_34rem)] px-4 sm:px-6">
        <div className="flex w-full max-w-3xl flex-col gap-4">
          <MemoMessageList />
          <MemoComposer />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col bg-[radial-gradient(circle_at_top_left,hsl(var(--muted))_0,transparent_34rem)]">
      <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 sm:px-6">
        <MemoMessageList />
        <div className="sticky bottom-0 z-10 mt-auto">
          <MemoComposer />
        </div>
      </div>
    </div>
  );
}

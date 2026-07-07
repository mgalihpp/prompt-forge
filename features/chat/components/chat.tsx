"use client";

import { MessageList } from "./message-list";
import { Composer } from "./composer";
import { useChat } from "@ai-sdk/react";
import { chat } from "../chat-instance";

export function Chat() {
  const { messages, status } = useChat({ chat });
  const isEmpty = messages.length === 0 && status !== "submitted";

  return (
    <div className="flex h-full w-full flex-col bg-[radial-gradient(circle_at_top_left,hsl(var(--muted))_0,transparent_34rem)]">
      {isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6">
          <div className="w-full max-w-3xl space-y-4">
            <MessageList />
            <Composer />
          </div>
        </div>
      ) : (
        <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 sm:px-6">
          <MessageList />
          <div className="sticky bottom-0 z-10 mt-auto">
            <Composer />
          </div>
        </div>
      )}
    </div>
  );
}

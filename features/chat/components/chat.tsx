"use client";

import { MessageList } from "./message-list";
import { Composer } from "./composer";
import { useChat } from "@ai-sdk/react";
import { chat } from "../chat-instance";

export function Chat() {
  const { messages, status } = useChat({ chat });
  const isEmpty = messages.length === 0 && status !== "submitted";

  if (isEmpty) {
    return (
      <div className="mx-auto flex h-full w-full max-w-full flex-col items-center justify-center bg-[radial-gradient(circle_at_top_left,hsl(var(--muted))_0,transparent_34rem)] px-4">
        <MessageList />
        <div className="w-full max-w-2xl">
          <Composer />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-full flex-col bg-[radial-gradient(circle_at_top_left,hsl(var(--muted))_0,transparent_34rem)]">
      <MessageList />
      <Composer />
    </div>
  );
}

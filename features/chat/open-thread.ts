import type { UIMessage } from "ai";
import { client } from "@/lib/orpc/client";
import { chat } from "./chat-instance";
import { useChatStore } from "./store";

/**
 * Load a past conversation into the singleton Chat instance so the existing
 * chat surface renders it, and point the composer's persistence at it.
 */
export async function openThread(threadId: string) {
  const thread = await client.history.messages({ threadId });

  chat.messages = thread.messages.map(
    (m): UIMessage => ({
      id: m.id,
      role: m.role as "user" | "assistant",
      parts: [{ type: "text", text: m.text }],
    }),
  );
  useChatStore.getState().setThreadId(thread.id);
}

/** Reset the surface for a fresh conversation. */
export function newChat() {
  chat.messages = [];
  useChatStore.setState({ threadId: null, input: "" });
}

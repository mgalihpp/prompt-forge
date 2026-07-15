import type { ForgeUIMessage } from "@/lib/deep-forge";
import { client } from "@/lib/orpc/client";
import { chat } from "./chat-instance";
import { useChatStore } from "./store";

/**
 * Load a past conversation into the singleton Chat instance so the existing
 * chat surface renders it, and point the composer's persistence at it.
 */
export async function openThread(threadId: string) {
  const thread = await client.history.messages({ threadId });

  chat.messages = thread.messages.map((m): ForgeUIMessage => {
    // Deep-forge turns persisted their structured parts (variants + review);
    // plain turns rehydrate from the flat text as before.
    const parts = m.parts as ForgeUIMessage["parts"] | null;
    return {
      id: m.id,
      role: m.role as "user" | "assistant",
      parts:
        Array.isArray(parts) && parts.length
          ? parts
          : [{ type: "text", text: m.text }],
    };
  });
  useChatStore.getState().setThreadId(thread.id);
}

/** Reset the surface for a fresh conversation. */
export function newChat() {
  chat.messages = [];
  useChatStore.setState({ threadId: null, input: "" });
}

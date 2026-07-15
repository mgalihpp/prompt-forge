"use client";

import { useCallback } from "react";
import { useCreateThread } from "@/lib/hooks/use-history";
import { chat } from "./chat-instance";
import { useChatStore } from "./store";

/**
 * Shared send path for the composer and the deep-forge follow-up chips:
 * lazily create the history thread on first message, then send with the
 * current opts/deepForge/threadId as request body. No-op while streaming.
 */
export function useSendText() {
  // mutateAsync is referentially stable, so the returned callback is too.
  const { mutateAsync: createThread } = useCreateThread();

  return useCallback(
    async (raw: string) => {
      const text = raw.trim();
      const busy = chat.status === "submitted" || chat.status === "streaming";
      if (!text || busy) return;

      const { opts, deepForge, threadId } = useChatStore.getState();

      // Lazily create the history thread on the first message. If it fails,
      // the chat still works — the exchange just isn't persisted.
      let tid = threadId;
      if (!tid) {
        tid = await createThread({
          title: text.replace(/\s+/g, " ").slice(0, 80),
        })
          .then((t) => t.id)
          .catch(() => null);
        if (tid) useChatStore.setState({ threadId: tid });
      }

      chat.sendMessage({ text }, { body: { opts, deepForge, threadId: tid } });
    },
    [createThread],
  );
}

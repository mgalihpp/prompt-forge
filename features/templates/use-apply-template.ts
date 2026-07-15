"use client";

import { useRouter } from "next/navigation";
import { newChat } from "@/features/chat/open-thread";
import { useChatStore } from "@/features/chat/store";

/**
 * Prefill the composer from a template and jump to the chat surface.
 * `newChat()` must run first — it clears the input that `applyPreset` sets.
 */
export function useApplyTemplate() {
  const router = useRouter();
  return (t: {
    ore: string;
    opts: Record<string, string>;
    deepForge?: boolean;
  }) => {
    newChat();
    useChatStore.getState().applyPreset(t);
    router.push("/chat");
  };
}

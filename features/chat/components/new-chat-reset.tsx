"use client";

import { useEffect } from "react";
import { newChat } from "../open-thread";
import { useChatStore } from "../store";

/** Landing on /chat (no thread in the URL) always means a fresh surface. */
export function NewChatReset() {
  useEffect(() => {
    if (useChatStore.getState().threadId) newChat();
  }, []);
  return null;
}

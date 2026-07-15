import { Chat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { ForgeUIMessage } from "@/lib/deep-forge";

// Single shared Chat instance so Composer (sendMessage) and MessageList
// (messages/status) stay in sync. Passing the same `id` string does NOT
// share state in AI SDK v5+ — you must share the instance itself.
// ponytail: one chat surface, so a module singleton is enough.
// Typed with ForgeUIMessage so deep-forge data parts narrow across the UI.
export const chat = new Chat<ForgeUIMessage>({
  transport: new DefaultChatTransport({ api: "/api/chat" }),
});

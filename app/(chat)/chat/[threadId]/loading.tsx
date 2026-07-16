import { ThreadSkeleton } from "@/features/chat/components/chat-skeleton";

/** Shown while [threadId]/page.tsx awaits history.messages on the server. */
export default function ThreadLoading() {
  return <ThreadSkeleton />;
}

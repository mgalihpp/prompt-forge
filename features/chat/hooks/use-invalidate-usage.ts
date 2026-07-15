import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc/client";
import { chat } from "../chat-instance";

/**
 * Subscribes to Chat status transitions and invalidates the usage query
 * whenever a stream completes (submitted/streaming → ready).
 *
 * Drop this into any component rendered alongside the Chat instance
 * (e.g. Chat layout) so the UsageCard picks up the new count immediately
 * after each prompt finishes.
 */
export function useInvalidateUsageOnChat() {
  const queryClient = useQueryClient();
  const prevRef = useRef(chat.status);

  useEffect(() => {
    const onStatusChange = () => {
      const current = chat.status;
      const prev = prevRef.current;
      prevRef.current = current;

      if (
        (prev === "submitted" || prev === "streaming") &&
        current === "ready"
      ) {
        queryClient.invalidateQueries({ queryKey: orpc.user.usage.key() });
      }
    };

    const unsub = (chat as any)["~registerStatusCallback"](onStatusChange);
    return unsub;
  }, [queryClient]);
}

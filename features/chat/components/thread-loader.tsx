"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { orpc } from "@/lib/orpc/client";
import { loadThread } from "../open-thread";
import { useChatStore } from "../store";

/**
 * Syncs the /chat/[threadId] URL into the singleton Chat instance. The query
 * is prefetched on the server, so on first paint the data is already cached.
 */
export function ThreadLoader({ threadId }: { threadId: string }) {
  const { data } = useQuery(
    orpc.history.messages.queryOptions({ input: { threadId } }),
  );

  useEffect(() => {
    if (!data) return;
    // Already live on the surface (composer created it and shallow-updated
    // the URL) — reloading from the DB would clobber the in-flight stream.
    if (useChatStore.getState().threadId === data.id) return;
    loadThread(data);
  }, [data]);

  return null;
}

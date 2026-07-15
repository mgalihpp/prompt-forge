"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc/client";

export function useThreads() {
  return useQuery(orpc.history.threads.queryOptions());
}

export function useSearchHistory(q: string) {
  return useQuery({
    ...orpc.history.search.queryOptions({ input: { q } }),
    enabled: q.trim().length >= 2,
    placeholderData: (prev) => prev, // keep old results while typing
  });
}

function useInvalidateHistory() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: orpc.history.key() });
}

export function useCreateThread() {
  const invalidate = useInvalidateHistory();
  return useMutation(
    orpc.history.createThread.mutationOptions({ onSuccess: invalidate }),
  );
}

export function useDeleteThread() {
  const invalidate = useInvalidateHistory();
  return useMutation(
    orpc.history.deleteThread.mutationOptions({ onSuccess: invalidate }),
  );
}

export function useDeleteMessages() {
  const invalidate = useInvalidateHistory();
  return useMutation(
    orpc.history.deleteMessages.mutationOptions({ onSuccess: invalidate }),
  );
}

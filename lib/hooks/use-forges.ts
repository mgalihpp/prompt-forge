"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc/client";

export function useForges() {
  return useQuery(orpc.forge.list.queryOptions());
}

function useInvalidateForges() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: orpc.forge.list.key() });
}

export function useSaveForge() {
  const invalidate = useInvalidateForges();
  return useMutation(
    orpc.forge.create.mutationOptions({ onSuccess: invalidate }),
  );
}

export function useDeleteForge() {
  const invalidate = useInvalidateForges();
  return useMutation(
    orpc.forge.delete.mutationOptions({ onSuccess: invalidate }),
  );
}

export function useToggleFavorite() {
  const invalidate = useInvalidateForges();
  return useMutation(
    orpc.forge.toggleFavorite.mutationOptions({ onSuccess: invalidate }),
  );
}

export function useShareForge() {
  const invalidate = useInvalidateForges();
  return useMutation(
    orpc.forge.share.mutationOptions({ onSuccess: invalidate }),
  );
}

export function useUnshareForge() {
  const invalidate = useInvalidateForges();
  return useMutation(
    orpc.forge.unshare.mutationOptions({ onSuccess: invalidate }),
  );
}

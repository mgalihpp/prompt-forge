"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc/client";

export function useTemplates() {
  return useQuery(orpc.template.list.queryOptions());
}

function useInvalidateTemplates() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: orpc.template.list.key() });
}

export function useCreateTemplate() {
  const invalidate = useInvalidateTemplates();
  return useMutation(
    orpc.template.create.mutationOptions({ onSuccess: invalidate }),
  );
}

export function useDeleteTemplate() {
  const invalidate = useInvalidateTemplates();
  return useMutation(
    orpc.template.delete.mutationOptions({ onSuccess: invalidate }),
  );
}

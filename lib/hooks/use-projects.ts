"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc/client";

export function useProjects() {
  return useQuery(orpc.project.list.queryOptions());
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation(
    orpc.project.create.mutationOptions({
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: orpc.project.list.key() }),
    }),
  );
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation(
    orpc.project.update.mutationOptions({
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: orpc.project.list.key() }),
    }),
  );
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation(
    orpc.project.delete.mutationOptions({
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: orpc.project.list.key() }),
    }),
  );
}

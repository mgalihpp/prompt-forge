"use client";

import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc/client";

export function useModels() {
  return useQuery({
    ...orpc.model.list.queryOptions(),
    staleTime: 10 * 60 * 1000, // matches the server cache TTL
  });
}

"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchArticle,
  fetchArticles,
  fetchSources,
  fetchStats,
  runIngestion,
} from "./client";
import type { ArticlesQuery, Category } from "./types";

const STALE_MS = 3 * 60 * 1000;

export function useArticles(params: ArticlesQuery) {
  return useQuery({
    queryKey: ["articles", params],
    queryFn: () => fetchArticles(params),
    staleTime: STALE_MS,
    placeholderData: (prev) => prev,
  });
}

export function useArticle(id: number) {
  return useQuery({
    queryKey: ["article", id],
    queryFn: () => fetchArticle(id),
    staleTime: STALE_MS,
    enabled: id > 0,
  });
}

export function useSources(category?: Category) {
  return useQuery({
    queryKey: ["sources", category],
    queryFn: () => fetchSources({ category, active: true }),
    staleTime: STALE_MS,
  });
}

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
    staleTime: STALE_MS,
  });
}

export function useIngestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: runIngestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

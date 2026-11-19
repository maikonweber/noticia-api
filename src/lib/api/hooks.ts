"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchArticle,
  fetchArticles,
  fetchBanners,
  fetchFeaturedBanners,
  fetchOfferGroups,
  fetchOfferRanking,
  fetchSources,
  fetchStats,
  fetchVulnerabilities,
  fetchVulnerabilityStats,
  runIngestion,
} from "./client";
import {
  BANNER_LIMIT,
  fetchFreshOffers,
  fetchHeroBanners,
  fetchHighValueProducts,
  fetchNotebookBanners,
  fetchSidebarOffers,
  HIGH_VALUE_LIMIT,
  HIGH_VALUE_MIN_PRICE,
} from "./offers";
import type {
  ArticlesQuery,
  ArticlesResponse,
  BannersQuery,
  Category,
  VulnerabilitiesQuery,
  VulnerabilitiesResponse,
  VulnerabilityStats,
} from "./types";

const STALE_MS = 3 * 60 * 1000;

export function useArticles(
  params: ArticlesQuery,
  options?: { initialData?: ArticlesResponse },
) {
  return useQuery({
    queryKey: ["articles", params],
    queryFn: () => fetchArticles(params),
    staleTime: STALE_MS,
    placeholderData: (prev) => prev,
    initialData: options?.initialData,
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

const BANNERS_STALE_MS = 0;
/** Atualiza banners consultando a API a cada 30s */
export const BANNERS_REFETCH_MS = 30_000;

const offerQueryDefaults = {
  staleTime: BANNERS_STALE_MS,
  gcTime: 60_000,
  refetchOnMount: "always" as const,
  refetchOnWindowFocus: true,
  refetchInterval: BANNERS_REFETCH_MS,
  retry: 1,
};

export function useBanners(params: BannersQuery) {
  return useQuery({
    queryKey: ["banners", params],
    queryFn: () => fetchBanners(params),
    ...offerQueryDefaults,
  });
}

export function useFeaturedBanners(params?: {
  limit?: number;
  placement?: string;
}) {
  return useQuery({
    queryKey: ["banners", "featured", params],
    queryFn: () => fetchFeaturedBanners(params),
    ...offerQueryDefaults,
  });
}

export function useNotebookBanners(limit = BANNER_LIMIT) {
  return useQuery({
    queryKey: ["offers", "notebook", limit],
    queryFn: () => fetchNotebookBanners(limit),
    ...offerQueryDefaults,
  });
}

export function useHeroBanners(limit = 5) {
  return useQuery({
    queryKey: ["offers", "hero", limit],
    queryFn: () => fetchHeroBanners(limit),
    ...offerQueryDefaults,
  });
}

export function useSidebarOffers(limit = 4) {
  return useQuery({
    queryKey: ["offers", "sidebar", limit],
    queryFn: () => fetchSidebarOffers(limit),
    ...offerQueryDefaults,
  });
}

export function useHighValueProducts(options?: {
  minPrice?: number;
  limit?: number;
}) {
  const minPrice = options?.minPrice ?? HIGH_VALUE_MIN_PRICE;
  const limit = options?.limit ?? HIGH_VALUE_LIMIT;
  return useQuery({
    queryKey: ["offers", "high-value", minPrice, limit],
    queryFn: () => fetchHighValueProducts({ minPrice, limit }),
    ...offerQueryDefaults,
  });
}

/** Ofertas genéricas frescas (página aleatória do catálogo/Shopee) */
export function useFreshOffers(limit = BANNER_LIMIT, slot = 0) {
  return useQuery({
    queryKey: ["offers", "fresh", limit, slot],
    queryFn: () => fetchFreshOffers({ limit }),
    ...offerQueryDefaults,
  });
}

export function useOfferRanking(limit = 24) {
  return useQuery({
    queryKey: ["offers", "ranking", limit],
    queryFn: () => fetchOfferRanking({ limit }),
    staleTime: 60_000,
  });
}

export function useOfferGroups() {
  return useQuery({
    queryKey: ["offer-groups"],
    queryFn: fetchOfferGroups,
    staleTime: 60_000,
  });
}

export function useVulnerabilities(
  params: VulnerabilitiesQuery,
  options?: { initialData?: VulnerabilitiesResponse },
) {
  return useQuery({
    queryKey: ["vulnerabilities", params],
    queryFn: () => fetchVulnerabilities(params),
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
    initialData: options?.initialData,
  });
}

export function useVulnerabilityStats(options?: {
  initialData?: VulnerabilityStats;
}) {
  return useQuery({
    queryKey: ["vulnerability-stats"],
    queryFn: fetchVulnerabilityStats,
    staleTime: 2 * 60 * 1000,
    initialData: options?.initialData,
  });
}

/** Lista "carregar mais"/rolagem infinita — usada no feed e na página de CVEs. */
export function useInfiniteArticles(
  params: Omit<ArticlesQuery, "page">,
  options?: { initialData?: ArticlesResponse },
) {
  return useInfiniteQuery({
    queryKey: ["articles-infinite", params],
    queryFn: ({ pageParam }) => fetchArticles({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < last.totalPages ? last.page + 1 : undefined,
    staleTime: STALE_MS,
    initialData: options?.initialData
      ? { pages: [options.initialData], pageParams: [1] }
      : undefined,
  });
}

export function useInfiniteVulnerabilities(
  params: Omit<VulnerabilitiesQuery, "page">,
  options?: { initialData?: VulnerabilitiesResponse },
) {
  return useInfiniteQuery({
    queryKey: ["vulnerabilities-infinite", params],
    queryFn: ({ pageParam }) => fetchVulnerabilities({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < last.totalPages ? last.page + 1 : undefined,
    staleTime: 2 * 60 * 1000,
    initialData: options?.initialData
      ? { pages: [options.initialData], pageParams: [1] }
      : undefined,
  });
}

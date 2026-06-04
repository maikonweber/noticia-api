import { API_BASE } from "./config";
import type {
  Article,
  ArticlesQuery,
  ArticlesResponse,
  BannersQuery,
  BannersResponse,
  FeaturedBannersResponse,
  IngestionResult,
  SourcesResponse,
  StatsResponse,
} from "./types";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const err = new Error(`API ${res.status}`) as Error & { status: number };
    err.status = res.status;
    throw err;
  }

  return res.json() as Promise<T>;
}

function toSearchParams(
  params: Record<string, string | number | boolean | undefined>,
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchArticles(
  params: ArticlesQuery = {},
): Promise<ArticlesResponse> {
  return apiFetch<ArticlesResponse>(
    `/articles${toSearchParams({
      category: params.category,
      sourceName: params.sourceName,
      sourceType: params.sourceType,
      q: params.q,
      from: params.from,
      to: params.to,
      page: params.page ?? 1,
      limit: params.limit ?? 20,
    })}`,
    { cache: "no-store" },
  );
}

export async function fetchArticle(id: number): Promise<Article> {
  return apiFetch<Article>(`/articles/${id}`, { cache: "no-store" });
}

export async function fetchSources(params?: {
  category?: string;
  active?: boolean;
}): Promise<SourcesResponse> {
  return apiFetch<SourcesResponse>(
    `/sources${toSearchParams({
      category: params?.category,
      active: params?.active ?? true,
    })}`,
  );
}

export async function fetchStats(): Promise<StatsResponse> {
  return apiFetch<StatsResponse>("/stats");
}

export async function runIngestion(body?: {
  ensureSources?: boolean;
  category?: string;
}): Promise<IngestionResult> {
  return apiFetch<IngestionResult>("/ingestion/run", {
    method: "POST",
    body: JSON.stringify({
      ensureSources: body?.ensureSources ?? true,
      category: body?.category,
    }),
    cache: "no-store",
  });
}

export async function fetchBanners(
  params: BannersQuery = {},
): Promise<BannersResponse> {
  return apiFetch<BannersResponse>(
    `/banners${toSearchParams({
      type: params.type,
      placement: params.placement,
      featured: params.featured,
      q: params.q,
      page: params.page ?? 1,
      limit: params.limit ?? 20,
    })}`,
    { cache: "no-store" },
  );
}

export async function fetchFeaturedBanners(params?: {
  limit?: number;
  placement?: string;
}): Promise<FeaturedBannersResponse> {
  return apiFetch<FeaturedBannersResponse>(
    `/banners/featured${toSearchParams({
      limit: params?.limit ?? 5,
      placement: params?.placement,
    })}`,
    { cache: "no-store" },
  );
}

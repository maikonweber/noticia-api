import { API_BASE } from "./config";
import type {
  Article,
  ArticlesQuery,
  ArticlesResponse,
  BannersQuery,
  BannersResponse,
  FeaturedBannersResponse,
  IngestionResult,
  OfferGroup,
  OfferGroupsResponse,
  SourcesResponse,
  StatsResponse,
  VulnerabilitiesQuery,
  VulnerabilitiesResponse,
  Vulnerability,
  VulnerabilityStats,
  WhatsAppPeerGroup,
  WhatsAppSession,
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
      topic: params.topic,
      onePiece: params.onePiece || undefined,
      spoiler: params.spoiler || undefined,
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

export async function fetchOfferRanking(params?: {
  page?: number;
  limit?: number;
}): Promise<BannersResponse> {
  return apiFetch<BannersResponse>(
    `/offers/ranking${toSearchParams({
      page: params?.page ?? 1,
      limit: params?.limit ?? 24,
    })}`,
    { cache: "no-store" },
  );
}

export async function fetchOfferGroups(): Promise<OfferGroupsResponse> {
  return apiFetch<OfferGroupsResponse>("/offer-groups", { cache: "no-store" });
}

function runnerHeaders(token: string): HeadersInit {
  return { "X-Runner-Token": token };
}

export async function fetchWhatsAppSession(
  token: string,
): Promise<WhatsAppSession> {
  return apiFetch<WhatsAppSession>("/whatsapp/session", {
    headers: runnerHeaders(token),
    cache: "no-store",
  });
}

export async function startWhatsAppSession(
  token: string,
): Promise<WhatsAppSession> {
  return apiFetch<WhatsAppSession>("/whatsapp/session/start", {
    method: "POST",
    headers: runnerHeaders(token),
  });
}

export async function stopWhatsAppSession(
  token: string,
): Promise<{ status: string }> {
  return apiFetch<{ status: string }>("/whatsapp/session", {
    method: "DELETE",
    headers: runnerHeaders(token),
  });
}

export async function fetchWhatsAppPeerGroups(
  token: string,
): Promise<{ items: WhatsAppPeerGroup[] }> {
  return apiFetch<{ items: WhatsAppPeerGroup[] }>("/whatsapp/groups", {
    headers: runnerHeaders(token),
    cache: "no-store",
  });
}

export async function fetchManagedOfferGroups(
  token: string,
): Promise<{ items: OfferGroup[] }> {
  return apiFetch<{ items: OfferGroup[] }>("/whatsapp/offer-groups", {
    headers: runnerHeaders(token),
    cache: "no-store",
  });
}

export async function registerOfferGroup(
  token: string,
  body: { jid: string; name?: string; description?: string; postsPerRun?: number },
) {
  return apiFetch("/whatsapp/offer-groups", {
    method: "POST",
    headers: runnerHeaders(token),
    body: JSON.stringify(body),
  });
}

export async function publishOfferGroupsNow(token: string) {
  return apiFetch("/whatsapp/publish", {
    method: "POST",
    headers: runnerHeaders(token),
  });
}

export async function fetchVulnerabilities(
  params: VulnerabilitiesQuery = {},
): Promise<VulnerabilitiesResponse> {
  return apiFetch<VulnerabilitiesResponse>(
    `/vulnerabilities${toSearchParams({
      q: params.q,
      severity: params.severity,
      kev: params.kev ? true : undefined,
      source: params.source,
      sort: params.sort,
      page: params.page ?? 1,
      limit: params.limit ?? 20,
    })}`,
    { cache: "no-store" },
  );
}

export async function fetchVulnerability(id: string): Promise<Vulnerability> {
  return apiFetch<Vulnerability>(
    `/vulnerabilities/${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );
}

export async function fetchVulnerabilityStats(): Promise<VulnerabilityStats> {
  return apiFetch<VulnerabilityStats>("/vulnerabilities/stats", {
    cache: "no-store",
  });
}

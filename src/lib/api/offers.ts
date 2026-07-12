import { fetchBanners, fetchFeaturedBanners } from "./client";
import { API_BASE } from "./config";
import type { Banner, BannersResponse } from "./types";

/** Constantes fáceis de ajustar */
export const NOTEBOOK_QUERY = "notebook";
export const HIGH_VALUE_MIN_PRICE = 1500;
export const BANNER_LIMIT = 8;
export const HIGH_VALUE_LIMIT = 12;

const HIGH_VALUE_KEYWORDS = [
  NOTEBOOK_QUERY,
  "ssd",
  "fone",
  "smart",
  "cpu",
  "computador",
  "tv",
  "gamer",
] as const;

const NOTEBOOK_FALLBACK_QUERIES = [
  NOTEBOOK_QUERY,
  "macbook",
  "ssd",
  "computador",
  "monitor",
] as const;

async function tryCatalog(params: {
  q?: string;
  type?: string;
  sort?: string;
  minPrice?: number;
  limit?: number;
}): Promise<BannersResponse | null> {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  try {
    const res = await fetch(`${API_BASE}/shopee/catalog?${search}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as BannersResponse;
  } catch {
    return null;
  }
}

async function tryLiveProducts(
  keyword: string,
  limit: number,
): Promise<BannersResponse | null> {
  try {
    const res = await fetch(
      `${API_BASE}/shopee/products?keyword=${encodeURIComponent(keyword)}&limit=${limit}`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    return (await res.json()) as BannersResponse;
  } catch {
    return null;
  }
}

function emptyPage(limit: number): BannersResponse {
  return { items: [], page: 1, limit, total: 0, totalPages: 1 };
}

function sortByPriceDesc(items: Banner[]): Banner[] {
  return [...items].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
}

function filterMinPrice(items: Banner[], minPrice: number): Banner[] {
  return items.filter((item) => (item.price ?? 0) >= minPrice);
}

function dedupeById(items: Banner[]): Banner[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = String(item.id);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Banner Tecnologia / Notebook — preferência por /banners; catalog/live só como fallback.
 */
export async function fetchNotebookBanners(
  limit = BANNER_LIMIT,
): Promise<BannersResponse> {
  const attempts: Array<() => Promise<BannersResponse>> = [
    async () =>
      fetchBanners({
        q: NOTEBOOK_QUERY,
        type: "product",
        featured: true,
        limit,
      }),
    async () =>
      fetchBanners({ q: NOTEBOOK_QUERY, type: "product", limit }),
    async () => {
      const featured = await fetchFeaturedBanners({ limit });
      return {
        items: featured.items,
        page: 1,
        limit: featured.limit,
        total: featured.items.length,
        totalPages: 1,
      };
    },
  ];

  for (const run of attempts) {
    try {
      const res = await run();
      if (res.items.length > 0) return res;
    } catch {
      /* tenta próximo */
    }
  }

  for (const q of NOTEBOOK_FALLBACK_QUERIES) {
    if (q === NOTEBOOK_QUERY) continue;
    try {
      const res = await fetchBanners({ q, type: "product", limit });
      if (res.items.length > 0) return res;
    } catch {
      /* tenta próximo */
    }
  }

  const catalog = await tryCatalog({
    q: NOTEBOOK_QUERY,
    type: "product",
    sort: "sales",
    limit,
  });
  if (catalog?.items.length) return catalog;

  const live = await tryLiveProducts(NOTEBOOK_QUERY, limit);
  if (live?.items.length) return live;

  return emptyPage(limit);
}

/**
 * Hero: campanhas/hero se existirem; senão notebooks.
 */
export async function fetchHeroBanners(
  limit = 5,
): Promise<{ items: Banner[]; limit: number; placement?: string }> {
  try {
    const hero = await fetchFeaturedBanners({ limit, placement: "hero" });
    if (hero.items.length > 0) return hero;
  } catch {
    /* fallback */
  }

  try {
    const campaigns = await fetchBanners({
      type: "campaign",
      placement: "hero",
      featured: true,
      limit,
    });
    if (campaigns.items.length > 0) {
      return { items: campaigns.items, limit, placement: "hero" };
    }
  } catch {
    /* fallback */
  }

  const notebooks = await fetchNotebookBanners(limit);
  return { items: notebooks.items, limit, placement: "hero" };
}

/**
 * Lateral: produtos notebook (placement=sidebar se houver; senão q=notebook).
 */
export async function fetchSidebarOffers(
  limit = 4,
): Promise<BannersResponse> {
  try {
    const placed = await fetchBanners({
      placement: "sidebar",
      type: "product",
      limit,
    });
    if (placed.items.length > 0) return placed;
  } catch {
    /* fallback */
  }

  try {
    const shops = await fetchBanners({
      type: "shop",
      placement: "sidebar",
      limit,
    });
    if (shops.items.length > 0) return shops;
  } catch {
    /* fallback */
  }

  return fetchNotebookBanners(limit);
}

/**
 * Aparelhos de alto valor — catalog com minPrice quando existir; senão banners + filtro.
 */
export async function fetchHighValueProducts(options?: {
  minPrice?: number;
  limit?: number;
}): Promise<BannersResponse> {
  const minPrice = options?.minPrice ?? HIGH_VALUE_MIN_PRICE;
  const limit = options?.limit ?? HIGH_VALUE_LIMIT;

  const catalog = await tryCatalog({
    type: "product",
    minPrice,
    sort: "price_desc",
    limit,
  });
  if (catalog?.items.length) return catalog;

  const techCatalog = await tryCatalog({
    q: NOTEBOOK_QUERY,
    type: "product",
    minPrice,
    sort: "price_desc",
    limit,
  });
  if (techCatalog?.items.length) return techCatalog;

  const thresholds = [minPrice, 800, 500, 300];
  let collected: Banner[] = [];

  for (const q of HIGH_VALUE_KEYWORDS) {
    try {
      const res = await fetchBanners({ q, type: "product", limit: 40 });
      collected = dedupeById([...collected, ...res.items]);
    } catch {
      /* ignore */
    }
  }

  for (const threshold of thresholds) {
    const filtered = sortByPriceDesc(filterMinPrice(collected, threshold)).slice(
      0,
      limit,
    );
    if (filtered.length > 0) {
      return {
        items: filtered,
        page: 1,
        limit,
        total: filtered.length,
        totalPages: 1,
      };
    }
  }

  const live = await tryLiveProducts(NOTEBOOK_QUERY, limit);
  if (live?.items.length) {
    const filtered = sortByPriceDesc(
      filterMinPrice(live.items, thresholds[thresholds.length - 1]),
    ).slice(0, limit);
    if (filtered.length) {
      return {
        items: filtered,
        page: 1,
        limit,
        total: filtered.length,
        totalPages: 1,
      };
    }
  }

  return emptyPage(limit);
}

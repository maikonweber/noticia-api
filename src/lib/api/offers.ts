import { fetchBanners, fetchFeaturedBanners } from "./client";
import { API_BASE } from "./config";
import type { Banner, BannersResponse } from "./types";

/** Constantes fáceis de ajustar */
export const NOTEBOOK_QUERY = "notebook";
export const HIGH_VALUE_MIN_PRICE = 1500;
export const BANNER_LIMIT = 12;
export const HIGH_VALUE_LIMIT = 12;
/** Páginas estimadas do catálogo (~900–1000 produtos) para sorteio */
export const CATALOG_PAGE_SPAN = 40;

const TECH_KEYWORDS = [
  "notebook",
  "ssd",
  "fone",
  "mouse",
  "teclado",
  "monitor",
  "gamer",
  "computador",
  "smart",
  "tablet",
  "carregador",
  "cabo",
] as const;

const HIGH_VALUE_KEYWORDS = [
  "notebook",
  "ssd",
  "fone",
  "smart",
  "cpu",
  "computador",
  "tv",
  "gamer",
] as const;

export type FreshOfferOptions = {
  limit?: number;
  /** Força palavra-chave; senão sorteia entre tech + catálogo geral */
  q?: string;
  minPrice?: number;
  sort?:
    | "relevance"
    | "commission"
    | "price_asc"
    | "price_desc"
    | "sales"
    | "recent";
  /** Preferir live Shopee em vez do cache catalog */
  preferLive?: boolean;
};

function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function pick<T>(items: readonly T[]): T {
  return items[randomInt(0, items.length - 1)]!;
}

function emptyPage(limit: number): BannersResponse {
  return { items: [], page: 1, limit, total: 0, totalPages: 1 };
}

function dedupeById(items: Banner[]): Banner[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = String(item.externalId || item.id);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j]!;
    arr[j] = tmp!;
  }
  return arr;
}

async function fetchCatalog(params: {
  q?: string;
  type?: string;
  sort?: string;
  minPrice?: number;
  page?: number;
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

async function fetchLiveProducts(params: {
  keyword: string;
  limit: number;
  page?: number;
  refresh?: boolean;
}): Promise<BannersResponse | null> {
  const search = new URLSearchParams({
    keyword: params.keyword,
    limit: String(params.limit),
    page: String(params.page ?? 1),
  });
  if (params.refresh) search.set("refresh", "true");
  try {
    const res = await fetch(`${API_BASE}/shopee/products?${search}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as BannersResponse;
    return data;
  } catch {
    return null;
  }
}

/**
 * Ofertas frescas: página aleatória do cache `/shopee/catalog`
 * (ou live `/shopee/products` ocasionalmente / sob demanda).
 */
export async function fetchFreshOffers(
  options: FreshOfferOptions = {},
): Promise<BannersResponse> {
  const limit = options.limit ?? BANNER_LIMIT;
  const sort = options.sort ?? pick(["sales", "recent", "commission", "relevance"] as const);
  const keyword =
    options.q ??
    (Math.random() < 0.35 ? undefined : pick(TECH_KEYWORDS));
  const page = randomInt(1, CATALOG_PAGE_SPAN);
  // Live (/shopee/products) consulta a Shopee a cada visita e falha com frequência
  // (502 "System Error" do upstream). No navegador usamos só o catálogo em cache.
  const useLive = options.preferLive === true;

  if (useLive && keyword) {
    const live = await fetchLiveProducts({
      keyword,
      limit,
      page: randomInt(1, 5),
      // refresh=true exige runner token (SHOPEE_REFRESH_REQUIRE_TOKEN) → 401 no navegador
    });
    if (live?.items.length) {
      return {
        ...live,
        items: shuffleInPlace(dedupeById(live.items)).slice(0, limit),
        limit,
      };
    }
  }

  const catalog = await fetchCatalog({
    q: keyword,
    type: "product",
    sort,
    minPrice: options.minPrice,
    page,
    limit,
  });

  if (catalog?.items.length) {
    return {
      ...catalog,
      items: shuffleInPlace(dedupeById(catalog.items)).slice(0, limit),
      limit,
    };
  }

  // Fallback: outra página / sem keyword
  const fallbackPage = randomInt(1, CATALOG_PAGE_SPAN);
  const broad = await fetchCatalog({
    type: "product",
    sort: "recent",
    page: fallbackPage,
    limit,
  });
  if (broad?.items.length) {
    return {
      ...broad,
      items: shuffleInPlace(dedupeById(broad.items)).slice(0, limit),
      limit,
    };
  }

  // Último recurso: /banners com página aleatória
  try {
    const banners = await fetchBanners({
      type: "product",
      page: randomInt(1, CATALOG_PAGE_SPAN),
      limit,
      ...(keyword ? { q: keyword } : {}),
    });
    if (banners.items.length) {
      return {
        ...banners,
        items: shuffleInPlace(dedupeById(banners.items)).slice(0, limit),
      };
    }
  } catch {
    /* ignore */
  }

  const featured = await fetchFeaturedBanners({ limit }).catch(() => null);
  if (featured?.items.length) {
    return {
      items: shuffleInPlace(dedupeById(featured.items)).slice(0, limit),
      page: 1,
      limit,
      total: featured.items.length,
      totalPages: 1,
    };
  }

  return emptyPage(limit);
}

export async function fetchNotebookBanners(
  limit = BANNER_LIMIT,
): Promise<BannersResponse> {
  // Mistura keyword notebook com outras tech — o catálogo "notebook" só tem ~2 itens
  const preferNotebook = Math.random() < 0.4;
  return fetchFreshOffers({
    limit,
    q: preferNotebook ? NOTEBOOK_QUERY : pick(TECH_KEYWORDS),
    sort: pick(["sales", "recent", "commission"]),
  });
}

export async function fetchHeroBanners(
  limit = 8,
): Promise<{ items: Banner[]; limit: number; placement?: string }> {
  try {
    const hero = await fetchFeaturedBanners({ limit, placement: "hero" });
    if (hero.items.length > 0) {
      return {
        items: shuffleInPlace([...hero.items]),
        limit,
        placement: "hero",
      };
    }
  } catch {
    /* fallback */
  }

  const fresh = await fetchFreshOffers({ limit, sort: "sales" });
  return { items: fresh.items, limit, placement: "hero" };
}

export async function fetchSidebarOffers(
  limit = 4,
): Promise<BannersResponse> {
  return fetchFreshOffers({
    limit: Math.max(limit * 2, 8),
    sort: pick(["commission", "sales", "recent"]),
  });
}

export async function fetchHighValueProducts(options?: {
  minPrice?: number;
  limit?: number;
}): Promise<BannersResponse> {
  const minPrice = options?.minPrice ?? HIGH_VALUE_MIN_PRICE;
  const limit = options?.limit ?? HIGH_VALUE_LIMIT;

  const catalog = await fetchCatalog({
    type: "product",
    minPrice,
    sort: "price_desc",
    page: randomInt(1, Math.max(1, Math.floor(15))),
    limit: Math.max(limit * 2, 16),
  });

  if (catalog?.items.length) {
    return {
      ...catalog,
      items: shuffleInPlace(dedupeById(catalog.items)).slice(0, limit),
      limit,
    };
  }

  // Abaixa o piso de preço se o catálogo caros estiver vazio
  for (const threshold of [minPrice, 800, 400, 100]) {
    const res = await fetchFreshOffers({
      limit: Math.max(limit * 2, 16),
      minPrice: threshold,
      sort: "price_desc",
      q: pick(HIGH_VALUE_KEYWORDS),
    });
    if (res.items.length) {
      return {
        ...res,
        items: res.items.slice(0, limit),
        limit,
      };
    }
  }

  return fetchFreshOffers({ limit, sort: "price_desc" });
}

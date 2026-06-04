export type Category =
  | "investimentos"
  | "tecnologia"
  | "programacao"
  | "esportes"
  | "entretenimento";
export type SourceType = "rss" | "html";

export type Article = {
  id: number;
  sourceType: SourceType;
  sourceName: string | null;
  sourceUrl: string;
  category: string;
  title: string;
  url: string | null;
  summary: string | null;
  body: string | null;
  bodyGeneratedAt: string | null;
  publishedAt: string | null;
  collectedAt: string;
};

/** Alias alinhado ao contrato notice-api */
export type ArticlesListResponse = ArticlesResponse;

export type ArticlesResponse = {
  items: Article[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type Source = {
  id: number;
  name: string;
  category: string;
  sourceType: SourceType;
  sourceUrl: string;
  selector: string;
  active: boolean;
};

export type SourcesResponse = {
  items: Source[];
};

export type StatsResponse = {
  byCategory: { category: string; count: number }[];
  bySource: { sourceName: string; count: number }[];
};

export type IngestionResult = {
  processedSources: number;
  collected: number;
  inserted: number;
  failures: { source: string; message: string }[];
};

export type ArticlesQuery = {
  category?: Category;
  sourceName?: string;
  sourceType?: SourceType;
  q?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
};

export type BannerType = "product" | "shop" | "campaign";

export type Banner = {
  id: number;
  type: BannerType;
  externalId: string;
  title: string;
  imageUrl: string | null;
  link: string;
  originalLink: string | null;
  price: number | null;
  priceMin: number | null;
  priceMax: number | null;
  discountPercent: number | null;
  commissionRate: number | null;
  commissionPercent: number | null;
  commission: number | null;
  sales: number | null;
  rating: number | null;
  shop: { id: number; name: string } | null;
  categoryId: number | null;
  periodStart: string | null;
  periodEnd: string | null;
  placement: string;
  featured: boolean;
  metadata: Record<string, unknown>;
  syncedAt: string;
  updatedAt: string;
};

export type BannersResponse = {
  items: Banner[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type FeaturedBannersResponse = {
  items: Banner[];
  limit: number;
  placement?: string;
};

export type BannersQuery = {
  type?: BannerType;
  placement?: string;
  featured?: boolean;
  q?: string;
  page?: number;
  limit?: number;
};

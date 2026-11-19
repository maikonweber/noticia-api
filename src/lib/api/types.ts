export type Category =
  | "investimentos"
  | "mercado-crypto"
  | "tecnologia"
  | "programacao"
  | "esportes"
  | "entretenimento"
  | "games"
  | "cinema"
  | "seguranca"
  | "ia"
  | "economia"
  | "brasil"
  | "mundo"
  | "ciencia";
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
  id: number | string;
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
  shop: { id: number | string; name: string } | null;
  categoryId: number | null;
  periodStart: string | null;
  periodEnd: string | null;
  placement: string;
  featured: boolean;
  rankScore?: number | null;
  rank?: number | null;
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

export type OfferGroup = {
  id: number;
  name: string;
  description: string | null;
  inviteLink: string;
  postsPerRun: number;
};

export type OfferGroupsResponse = {
  items: OfferGroup[];
};

export type WhatsAppSession = {
  id: string;
  status: string;
  connectionState?: string;
  phone: string | null;
  qrcode: string | null;
  active?: boolean;
  lastConnectedAt?: string | null;
};

export type WhatsAppPeerGroup = {
  jid: string;
  name: string;
  size: number;
  announce: boolean;
};


export type VulnSeverity =
  | "CRITICAL"
  | "HIGH"
  | "MEDIUM"
  | "LOW"
  | "NONE"
  | "UNKNOWN";

export type Vulnerability = {
  id: number;
  vulnId: string;
  aliases: string[];
  title: string | null;
  description: string | null;
  severity: VulnSeverity;
  cvssScore: number | null;
  cvssVersion: string | null;
  cvssVector: string | null;
  cvssSource: string | null;
  cwes: string[];
  vendors: string[];
  products: string[];
  packages: string[];
  references: string[];
  status: string | null;
  kev: boolean;
  kevDateAdded: string | null;
  kevDueDate: string | null;
  kevRequiredAction: string | null;
  kevRansomware: string | null;
  sources: string[];
  publishedAt: string | null;
  lastModifiedAt: string | null;
  firstSeenAt: string;
  updatedAt: string;
  updateCount: number;
};

export type VulnerabilitiesQuery = {
  q?: string;
  severity?: string;
  kev?: boolean;
  source?: "nvd" | "kev" | "ghsa";
  sort?: "modified" | "published" | "score" | "kev";
  page?: number;
  limit?: number;
};

export type VulnerabilitiesResponse = {
  items: Vulnerability[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type VulnerabilityStats = {
  total: number;
  kev: number;
  updated24h: number;
  published24h: number;
  lastUpdateAt: string | null;
  bySeverity: { severity: VulnSeverity; count: number }[];
  sync: {
    source: string;
    cursorAt: string | null;
    lastRunAt: string | null;
    lastSuccessAt: string | null;
  }[];
};

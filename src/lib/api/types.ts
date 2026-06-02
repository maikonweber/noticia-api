export type Category =
  | "investimentos"
  | "tecnologia"
  | "programacao"
  | "esportes";
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
  publishedAt: string | null;
  collectedAt: string;
};

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

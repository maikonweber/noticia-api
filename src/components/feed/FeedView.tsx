"use client";

import { useCallback, useState } from "react";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { CategoryTabs } from "@/components/articles/CategoryTabs";
import { EmptyState } from "@/components/articles/EmptyState";
import { ErrorState } from "@/components/articles/ErrorState";
import { Pagination } from "@/components/articles/Pagination";
import { SearchBar } from "@/components/articles/SearchBar";
import { SourceFilters } from "@/components/articles/SourceFilters";
import { Spinner } from "@/components/ui/Spinner";
import { useArticles, useSources } from "@/lib/api/hooks";
import type { Category } from "@/lib/api/types";
import { CATEGORIES } from "@/lib/categories";

export function FeedView() {
  const [category, setCategory] = useState<Category>("tecnologia");
  const [q, setQ] = useState("");
  const [sourceName, setSourceName] = useState<string | undefined>();
  const [page, setPage] = useState(1);

  const resetPage = useCallback(() => setPage(1), []);

  const handleCategory = (c: Category) => {
    setCategory(c);
    setSourceName(undefined);
    resetPage();
  };

  const handleSearch = (value: string) => {
    setQ(value);
    resetPage();
  };

  const handleSource = (name: string | undefined) => {
    setSourceName(name);
    resetPage();
  };

  const articlesQuery = useArticles({
    category,
    q: q || undefined,
    sourceName,
    page,
    limit: 20,
  });

  const sourcesQuery = useSources(category);
  const showAdmin = process.env.NEXT_PUBLIC_ENABLE_ADMIN === "true";
  const catMeta = CATEGORIES.find((c) => c.id === category);

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Feed de notícias
          </h1>
          {catMeta && (
            <p className="mt-1 text-sm text-[var(--muted)]">
              {catMeta.description}
            </p>
          )}
        </div>
        <CategoryTabs value={category} onChange={handleCategory} />
        <SearchBar value={q} onChange={handleSearch} />
        <SourceFilters
          sources={sourcesQuery.data?.items ?? []}
          selected={sourceName}
          onChange={handleSource}
          loading={sourcesQuery.isLoading}
        />
      </section>

      <section>
        {articlesQuery.isLoading && (
          <div className="flex justify-center py-20">
            <Spinner className="h-8 w-8" />
          </div>
        )}

        {articlesQuery.isError && (
          <ErrorState onRetry={() => articlesQuery.refetch()} />
        )}

        {articlesQuery.isSuccess && articlesQuery.data.total === 0 && (
          <EmptyState showAdminLink={showAdmin} />
        )}

        {articlesQuery.isSuccess && articlesQuery.data.total > 0 && (
          <div className="space-y-6">
            <div className="grid gap-4">
              {articlesQuery.data.items.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
            <Pagination
              page={articlesQuery.data.page}
              totalPages={articlesQuery.data.totalPages}
              total={articlesQuery.data.total}
              onPageChange={setPage}
            />
          </div>
        )}
      </section>
    </div>
  );
}

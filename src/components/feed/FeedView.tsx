"use client";

import { useCallback, useEffect, useState } from "react";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { CategoryTabs } from "@/components/articles/CategoryTabs";
import { EmptyState } from "@/components/articles/EmptyState";
import { ErrorState } from "@/components/articles/ErrorState";
import { Pagination } from "@/components/articles/Pagination";
import { SearchBar } from "@/components/articles/SearchBar";
import { SourceFilters } from "@/components/articles/SourceFilters";
import { HeroCarousel } from "@/components/banners/HeroCarousel";
import { HighValueGrid } from "@/components/banners/HighValueGrid";
import { InlineBanner } from "@/components/banners/InlineBanner";
import { SidebarBanner } from "@/components/banners/SidebarBanner";
import { Spinner } from "@/components/ui/Spinner";
import { useArticles, useSources } from "@/lib/api/hooks";
import type { Category } from "@/lib/api/types";
import { CATEGORIES } from "@/lib/categories";

type Props = {
  category: Category;
};

export function FeedView({ category }: Props) {
  const [q, setQ] = useState("");
  const [sourceName, setSourceName] = useState<string | undefined>();
  const [page, setPage] = useState(1);

  const resetPage = useCallback(() => setPage(1), []);

  // Garante estado limpo ao trocar de categoria via rota
  useEffect(() => {
    setQ("");
    setSourceName(undefined);
    setPage(1);
  }, [category]);

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
  const showTechOffers =
    category === "tecnologia" || category === "programacao";

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Notícias de {catMeta?.label ?? category}
          </h1>
          {catMeta && (
            <p className="mt-1 text-sm text-[var(--muted)]">
              {catMeta.description}. Atualizado continuamente no Notice.
            </p>
          )}
        </div>
        <CategoryTabs value={category} />
        <SearchBar value={q} onChange={handleSearch} />
        <SourceFilters
          sources={sourcesQuery.data?.items ?? []}
          selected={sourceName}
          onChange={handleSource}
          loading={sourcesQuery.isLoading}
        />
      </section>

      <HeroCarousel />

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start lg:gap-8">
        <section
          className="min-w-0 space-y-6"
          aria-label={`Lista de notícias — ${catMeta?.label ?? category}`}
        >
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
              <p className="text-xs text-[var(--muted)]">
                {articlesQuery.data.total}{" "}
                {articlesQuery.data.total === 1
                  ? "notícia encontrada"
                  : "notícias encontradas"}
              </p>
              <div className="grid gap-4">
                {articlesQuery.data.items.map((article, index) => (
                  <div key={article.id} className="contents">
                    <ArticleCard article={article} />
                    {(index === 2 || index === 7 || index === 14) && (
                      <InlineBanner
                        page={page + index}
                        variant={index === 7 ? "card" : "compact"}
                        focus="notebook"
                      />
                    )}
                  </div>
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

          <div className="lg:hidden">
            <SidebarBanner limit={2} title="Ofertas notebook" />
          </div>
        </section>

        <aside className="mt-8 hidden lg:mt-0 lg:block" aria-label="Ofertas">
          <SidebarBanner limit={4} title="Notebooks e tech" />
        </aside>
      </div>

      {showTechOffers && <HighValueGrid />}
    </div>
  );
}

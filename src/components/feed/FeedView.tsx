"use client";

import { useCallback, useState } from "react";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { CategoryTabs } from "@/components/articles/CategoryTabs";
import { EmptyState } from "@/components/articles/EmptyState";
import { ErrorState } from "@/components/articles/ErrorState";
import { SearchBar } from "@/components/articles/SearchBar";
import { SourceFilters } from "@/components/articles/SourceFilters";
import { HeroCarousel } from "@/components/banners/HeroCarousel";
import { HighValueGrid } from "@/components/banners/HighValueGrid";
import { InlineBanner } from "@/components/banners/InlineBanner";
import { SidebarBanner } from "@/components/banners/SidebarBanner";
import { Spinner } from "@/components/ui/Spinner";
import { LoadMore } from "@/components/ui/LoadMore";
import { useInfiniteArticles, useSources } from "@/lib/api/hooks";
import type { ArticlesResponse, Category } from "@/lib/api/types";
import { CATEGORIES } from "@/lib/categories";

type Props = {
  category: Category;
  /** Primeira página SSR — melhora indexação */
  initialArticles?: ArticlesResponse;
};

export function FeedView({ category, initialArticles }: Props) {
  const [q, setQ] = useState("");
  const [sourceName, setSourceName] = useState<string | undefined>();
  // Com "carregar mais" a lista reinicia sozinha quando os filtros mudam (nova queryKey)
  const resetPage = useCallback(() => {}, []);

  // Estado limpo por categoria: a página monta <FeedView key={category} />

  const handleSearch = (value: string) => {
    setQ(value);
    resetPage();
  };

  const handleSource = (name: string | undefined) => {
    setSourceName(name);
    resetPage();
  };

  const listParams = {
    category,
    q: q || undefined,
    sourceName,
    limit: 20,
  };

  const isDefaultList = !q && !sourceName;

  const articlesQuery = useInfiniteArticles(listParams, {
    initialData: isDefaultList ? initialArticles : undefined,
  });
  const pages = articlesQuery.data?.pages ?? [];
  const total = pages[0]?.total ?? 0;
  const items = pages.flatMap((p) => p.items);
  const page = 1;

  const sourcesQuery = useSources(category);
  const showAdmin = process.env.NEXT_PUBLIC_ENABLE_ADMIN === "true";
  const catMeta = CATEGORIES.find((c) => c.id === category);
  const showTechOffers =
    category === "tecnologia" || category === "programacao";

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <h1 className="text-[1.6rem] font-bold leading-tight tracking-tight sm:text-3xl">
            Notícias de {catMeta?.label ?? category}
          </h1>
          {catMeta && (
            <p className="mt-1 hidden text-sm text-[var(--muted)] sm:block">
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

          {articlesQuery.isSuccess && total === 0 && (
            <EmptyState showAdminLink={showAdmin} />
          )}

          {articlesQuery.isSuccess && total > 0 && (
            <div className="space-y-4 sm:space-y-6">
              <p className="text-xs text-[var(--muted)]">
                {total} {total === 1 ? "notícia encontrada" : "notícias encontradas"}
              </p>
              <div className="grid gap-3 sm:gap-4">
                {items.map((article, index) => (
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
              <LoadMore
                hasMore={Boolean(articlesQuery.hasNextPage)}
                loading={articlesQuery.isFetchingNextPage}
                onLoad={() => articlesQuery.fetchNextPage()}
                shown={items.length}
                total={total}
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

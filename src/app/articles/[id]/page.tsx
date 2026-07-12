import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InlineBannerStatic } from "@/components/banners/InlineBanner";
import { SidebarBannerStatic } from "@/components/banners/SidebarBanner";
import { ArticleBody } from "@/components/articles/ArticleBody";
import { EnrichedBadge } from "@/components/articles/EnrichedBadge";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchArticle } from "@/lib/api/client";
import {
  fetchNotebookBanners,
  fetchSidebarOffers,
} from "@/lib/api/offers";
import type { Banner } from "@/lib/api/types";
import { hasEnrichedBody } from "@/lib/articles";
import { CATEGORY_LABEL } from "@/lib/categories";
import { formatArticleDate } from "@/lib/format";
import {
  articlePath,
  buildArticleMetadata,
  buildBreadcrumbJsonLd,
  buildNewsArticleJsonLd,
  categoryPath,
  SITE_NAME,
} from "@/lib/seo";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const article = await fetchArticle(Number(id));
    return buildArticleMetadata(article);
  } catch {
    return {
      title: "Notícia não encontrada",
      robots: { index: false, follow: true },
    };
  }
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isFinite(numId) || numId < 1) notFound();

  let article;
  try {
    article = await fetchArticle(numId);
  } catch (err) {
    const status = (err as Error & { status?: number }).status;
    if (status === 404) notFound();
    throw err;
  }

  const dateStr = formatArticleDate(
    article.publishedAt,
    article.collectedAt,
  );
  const categoryLabel =
    CATEGORY_LABEL[article.category] ?? article.category;
  const categoryHref = categoryPath(article.category);
  const publishedIso = article.publishedAt ?? article.collectedAt;

  let inlineBanner: Banner | null = null;
  let sidebarBanners: Banner[] = [];
  try {
    const [notebookRes, sidebarRes] = await Promise.all([
      fetchNotebookBanners(8),
      fetchSidebarOffers(4),
    ]);
    const notebooks = notebookRes.items;
    if (notebooks.length > 0) {
      inlineBanner = notebooks[numId % notebooks.length] ?? null;
    }
    sidebarBanners =
      sidebarRes.items.length > 0 ? sidebarRes.items : notebooks.slice(0, 4);
  } catch {
    /* banners são opcionais */
  }

  return (
    <>
      <JsonLd data={buildNewsArticleJsonLd(article)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Início", path: "/" },
          { name: categoryLabel, path: categoryHref },
          { name: article.title, path: articlePath(article.id) },
        ])}
      />

      <div className="mx-auto max-w-5xl lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start lg:gap-8">
        <article
          className="min-w-0 max-w-2xl lg:max-w-none"
          itemScope
          itemType="https://schema.org/NewsArticle"
        >
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[var(--muted)]">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-[var(--accent)]">
                  Início
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href={categoryHref}
                  className="hover:text-[var(--accent)]"
                >
                  {categoryLabel}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="line-clamp-1 text-[var(--foreground)]" aria-current="page">
                Notícia
              </li>
            </ol>
          </nav>

          <header className="mb-6">
            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
              <Link
                href={categoryHref}
                className="rounded-full bg-[var(--elevated)] px-2 py-0.5 font-medium hover:text-[var(--accent)]"
              >
                {categoryLabel}
              </Link>
              {article.sourceName && (
                <span className="text-[var(--muted)]" itemProp="author">
                  {article.sourceName}
                </span>
              )}
              {hasEnrichedBody(article) && <EnrichedBadge />}
              <span className="text-[var(--muted)]">·</span>
              <time
                dateTime={publishedIso}
                itemProp="datePublished"
              >
                {dateStr}
              </time>
              <meta itemProp="dateModified" content={article.collectedAt} />
              <meta itemProp="inLanguage" content="pt-BR" />
              <meta itemProp="isAccessibleForFree" content="true" />
            </div>

            <h1
              className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl"
              itemProp="headline"
            >
              {article.title}
            </h1>
          </header>

          {hasEnrichedBody(article) ? (
            <div
              className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-base text-[var(--foreground)]"
              itemProp="articleBody"
            >
              <ArticleBody text={article.body!.trim()} />
            </div>
          ) : article.summary?.trim() ? (
            <div
              className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-base text-[var(--foreground)]"
              itemProp="description"
            >
              <ArticleBody text={article.summary.trim()} />
            </div>
          ) : (
            <p className="mb-8 text-sm text-[var(--muted)]">
              Conteúdo completo disponível na fonte original.
            </p>
          )}

          {inlineBanner && (
            <div className="mb-8">
              <InlineBannerStatic banner={inlineBanner} />
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {article.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-fg)] hover:opacity-90"
                itemProp="isBasedOn"
              >
                {hasEnrichedBody(article) || article.summary?.trim()
                  ? "Abrir fonte original ↗"
                  : "Ler na fonte ↗"}
              </a>
            )}
            {article.sourceUrl && (
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--foreground)]"
              >
                Feed da fonte
              </a>
            )}
          </div>

          <p className="mt-8 text-xs text-[var(--muted)]">
            Publicado no {SITE_NAME}. Categoria:{" "}
            <Link href={categoryHref} className="underline hover:text-[var(--accent)]">
              {categoryLabel}
            </Link>
            .
          </p>

          {sidebarBanners.length > 0 && (
            <div className="mt-10 lg:hidden">
              <SidebarBannerStatic
                banners={sidebarBanners.slice(0, 2)}
                title="Ofertas notebook"
              />
            </div>
          )}
        </article>

        {sidebarBanners.length > 0 && (
          <aside className="hidden lg:block" aria-label="Ofertas">
            <SidebarBannerStatic
              banners={sidebarBanners}
              title="Notebooks e tech"
            />
          </aside>
        )}
      </div>
    </>
  );
}

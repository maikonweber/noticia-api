import Link from "next/link";
import { ArticlePreviewSkeleton } from "@/components/articles/ArticlePreviewSkeleton";
import { EnrichedBadge } from "@/components/articles/EnrichedBadge";
import type { Article } from "@/lib/api/types";
import {
  getArticlePreview,
  hasEnrichedBody,
  isEnrichmentPending,
} from "@/lib/articles";
import { CATEGORY_LABEL } from "@/lib/categories";
import { formatRelativeDate } from "@/lib/format";

export function ArticleCard({ article }: { article: Article }) {
  const dateLabel = formatRelativeDate(
    article.publishedAt ?? article.collectedAt,
  );
  const preview = getArticlePreview(article);
  const showPreview = preview !== article.title;
  const pending = isEnrichmentPending(article);

  return (
    <article className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-shadow hover:shadow-md hover:shadow-black/5">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-[var(--elevated)] px-2 py-0.5 font-medium text-[var(--muted)]">
          {CATEGORY_LABEL[article.category] ?? article.category}
        </span>
        {hasEnrichedBody(article) && <EnrichedBadge />}
        {article.sourceName && (
          <span className="text-[var(--muted)]">{article.sourceName}</span>
        )}
        <span className="text-[var(--muted)]">·</span>
        <time
          dateTime={article.publishedAt ?? article.collectedAt}
          className="text-[var(--muted)]"
        >
          {dateLabel}
        </time>
      </div>

      <h2 className="mb-2 text-base font-semibold leading-snug tracking-tight">
        <Link
          href={`/articles/${article.id}`}
          className="text-[var(--foreground)] hover:text-[var(--accent)]"
        >
          {article.title}
        </Link>
      </h2>

      {pending && !showPreview ? (
        <ArticlePreviewSkeleton />
      ) : showPreview ? (
        <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-[var(--muted)]">
          {preview}
        </p>
      ) : null}

      {pending && showPreview && (
        <p className="mb-3 text-[10px] text-[var(--muted)]">
          Texto revisado em breve
        </p>
      )}

      <div className="flex items-center gap-3 text-sm">
        <Link
          href={`/articles/${article.id}`}
          className="font-medium text-[var(--accent)] hover:underline"
        >
          Ler mais
        </Link>
        {article.url && (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            Fonte original ↗
          </a>
        )}
      </div>
    </article>
  );
}

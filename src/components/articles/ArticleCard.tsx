import Link from "next/link";
import type { Article } from "@/lib/api/types";
import { CATEGORY_LABEL } from "@/lib/categories";
import { formatRelativeDate } from "@/lib/format";

export function ArticleCard({ article }: { article: Article }) {
  const dateLabel = formatRelativeDate(
    article.publishedAt ?? article.collectedAt,
  );

  return (
    <article className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-shadow hover:shadow-md hover:shadow-black/5">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-[var(--elevated)] px-2 py-0.5 font-medium text-[var(--muted)]">
          {CATEGORY_LABEL[article.category] ?? article.category}
        </span>
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

      {article.summary && (
        <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
          {article.summary}
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

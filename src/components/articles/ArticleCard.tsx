import Link from "next/link";
import type { Article } from "@/lib/api/types";
import { getArticlePreview } from "@/lib/articles";
import { CATEGORY_LABEL } from "@/lib/categories";
import { RelativeTime } from "@/components/ui/RelativeTime";
import {
  OnePieceBadge,
  SpoilerBadge,
  SpoilerReveal,
} from "@/components/articles/SpoilerReveal";

export function ArticleCard({ article }: { article: Article }) {
  const iso = article.publishedAt ?? article.collectedAt;
  const preview = getArticlePreview(article);
  const showPreview = preview !== article.title;
  const hideSpoiler = Boolean(article.isSpoiler);

  return (
    <article className="group relative rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-shadow hover:shadow-md hover:shadow-black/5 active:bg-[var(--elevated)]/60">
      <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
        <span className="rounded-full bg-[var(--elevated)] px-2 py-0.5 font-medium text-[var(--muted)]">
          {CATEGORY_LABEL[article.category] ?? article.category}
        </span>
        {article.isOnePiece ? <OnePieceBadge /> : null}
        {hideSpoiler ? <SpoilerBadge /> : null}
        {article.sourceName && (
          <span className="text-[var(--muted)]">{article.sourceName}</span>
        )}
        <span className="text-[var(--muted)]" aria-hidden>
          ·
        </span>
        <RelativeTime iso={iso} className="text-[var(--muted)]" />
      </div>

      <h2 className="mb-2 text-[1.05rem] font-semibold leading-snug tracking-tight sm:text-base">
        {/* O link do título cobre o card inteiro no toque (after:inset-0) */}
        <SpoilerReveal enabled={hideSpoiler}>
          <Link
            href={`/articles/${article.id}`}
            className="text-[var(--foreground)] after:absolute after:inset-0 after:rounded-xl after:content-[''] hover:text-[var(--accent)]"
          >
            {article.title}
          </Link>
        </SpoilerReveal>
      </h2>

      {showPreview ? (
        <SpoilerReveal enabled={hideSpoiler}>
          <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-[var(--muted)]">
            {preview}
          </p>
        </SpoilerReveal>
      ) : null}

      <div className="relative z-10 flex items-center gap-1 text-sm">
        <Link
          href={`/articles/${article.id}`}
          className="-ml-2 inline-flex min-h-11 items-center rounded-lg px-2 font-medium text-[var(--accent)] hover:underline sm:min-h-0 sm:py-1"
        >
          Ler mais
        </Link>
        {article.url && (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-lg px-2 text-[var(--muted)] hover:text-[var(--foreground)] sm:min-h-0 sm:py-1"
          >
            Fonte original ↗
          </a>
        )}
      </div>
    </article>
  );
}

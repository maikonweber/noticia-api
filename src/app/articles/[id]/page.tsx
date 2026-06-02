import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchArticle } from "@/lib/api/client";
import { CATEGORY_LABEL } from "@/lib/categories";
import { formatArticleDate } from "@/lib/format";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const article = await fetchArticle(Number(id));
    return { title: article.title };
  } catch {
    return { title: "Notícia não encontrada" };
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

  return (
    <article className="mx-auto max-w-2xl">
      <Link
        href="/"
        className="mb-6 inline-flex text-sm text-[var(--muted)] hover:text-[var(--accent)]"
      >
        ← Voltar ao feed
      </Link>

      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-[var(--elevated)] px-2 py-0.5 font-medium">
          {CATEGORY_LABEL[article.category] ?? article.category}
        </span>
        {article.sourceName && (
          <span className="text-[var(--muted)]">{article.sourceName}</span>
        )}
        <span className="text-[var(--muted)]">·</span>
        <time dateTime={article.publishedAt ?? article.collectedAt}>
          {dateStr}
        </time>
        <span className="rounded bg-[var(--elevated)] px-1.5 py-0.5 font-mono uppercase text-[10px] text-[var(--muted)]">
          {article.sourceType}
        </span>
      </div>

      <h1 className="mb-6 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
        {article.title}
      </h1>

      {article.summary ? (
        <div className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-base leading-relaxed text-[var(--foreground)]">
          {article.summary}
        </div>
      ) : (
        <p className="mb-8 text-sm italic text-[var(--muted)]">
          Sem resumo disponível.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        {article.url && (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-fg)] hover:opacity-90"
          >
            Abrir fonte original ↗
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
    </article>
  );
}

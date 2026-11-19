import type { Article } from "@/lib/api/types";

export const ARTICLE_PREVIEW_MAX_LENGTH = 180;

export function getArticleDisplayText(article: Article): string {
  if (article.summary?.trim()) return article.summary.trim();
  return article.title;
}

export function getArticlePreview(
  article: Article,
  maxLength = ARTICLE_PREVIEW_MAX_LENGTH,
): string {
  const text = getArticleDisplayText(article);
  if (text.length <= maxLength) return text;
  const slice = text.slice(0, maxLength);
  const lastSpace = slice.lastIndexOf(" ");
  const trimmed =
    lastSpace > maxLength * 0.6 ? slice.slice(0, lastSpace) : slice;
  return `${trimmed.trimEnd()}…`;
}

export function splitArticleParagraphs(text: string): string[] {
  const normalized = text.trim();
  if (!normalized) return [];
  const parts = normalized.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  return parts.length > 0 ? parts : [normalized];
}

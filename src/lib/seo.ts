import type { Metadata } from "next";
import type { Article } from "@/lib/api/types";
import { CATEGORIES, CATEGORY_LABEL } from "@/lib/categories";
import { getArticlePreview } from "@/lib/articles";

export const SITE_NAME = "Notice";
export const SITE_TAGLINE = "Notícias por categoria";
export const SITE_DESCRIPTION =
  "Agregador de notícias em português: investimentos, mercado crypto, tecnologia, programação, esportes, entretenimento, games e cinema. Atualizado continuamente.";

export const SITE_KEYWORDS = [
  "notícias",
  "noticias",
  "agregador de notícias",
  "tecnologia",
  "investimentos",
  "mercado crypto",
  "criptomoedas",
  "bitcoin",
  "blockchain",
  "programação",
  "esportes",
  "entretenimento",
  "games",
  "jogos",
  "eSports",
  "cinema",
  "séries",
  "filmes",
  "streaming",
  "feed de notícias",
  "Brasil",
] as const;

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}

export function absoluteUrl(path = "/"): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function truncateMeta(text: string, max = 158): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  const slice = normalized.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const trimmed =
    lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice;
  return `${trimmed.trimEnd()}…`;
}

export function categoryPath(categoryId: string): string {
  return `/categoria/${categoryId}`;
}

export function articlePath(id: number | string): string {
  return `/articles/${id}`;
}

export function buildRootMetadata(): Metadata {
  const url = getSiteUrl();
  return {
    metadataBase: new URL(url),
    title: {
      default: `${SITE_NAME} — ${SITE_TAGLINE}`,
      template: `%s · ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: [...SITE_KEYWORDS],
    applicationName: SITE_NAME,
    authors: [{ name: "Muttercorp" }],
    creator: "Muttercorp",
    publisher: "Muttercorp",
    category: "news",
    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url,
      siteName: SITE_NAME,
      title: `${SITE_NAME} — ${SITE_TAGLINE}`,
      description: SITE_DESCRIPTION,
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME} — ${SITE_TAGLINE}`,
      description: SITE_DESCRIPTION,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export function buildCategoryMetadata(categoryId: string): Metadata {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  const label = cat?.label ?? CATEGORY_LABEL[categoryId] ?? categoryId;
  const description = truncateMeta(
    cat
      ? `Notícias de ${label.toLowerCase()}: ${cat.description}. Leia as últimas matérias no ${SITE_NAME}.`
      : `Notícias de ${label} no ${SITE_NAME}.`,
  );
  const path = categoryPath(categoryId);
  const title = `Notícias de ${label}`;

  return {
    title,
    description,
    keywords: [label, "notícias", label.toLowerCase(), ...SITE_KEYWORDS],
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      title: `${title} · ${SITE_NAME}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${SITE_NAME}`,
      description,
    },
  };
}

export function buildArticleMetadata(article: Article): Metadata {
  const description = truncateMeta(
    getArticlePreview(article, 200) ||
      `Notícia sobre ${CATEGORY_LABEL[article.category] ?? article.category} no ${SITE_NAME}.`,
  );
  const path = articlePath(article.id);
  const published = article.publishedAt ?? article.collectedAt;
  const categoryLabel =
    CATEGORY_LABEL[article.category] ?? article.category;

  return {
    title: article.title,
    description,
    authors: article.sourceName
      ? [{ name: article.sourceName }]
      : [{ name: SITE_NAME }],
    category: categoryLabel,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      locale: "pt_BR",
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      title: article.title,
      description,
      publishedTime: published,
      modifiedTime: article.collectedAt,
      section: categoryLabel,
      authors: article.sourceName ? [article.sourceName] : undefined,
      tags: [categoryLabel, "notícias"],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
    },
  };
}

export function buildNewsArticleJsonLd(article: Article) {
  const path = articlePath(article.id);
  const description = truncateMeta(getArticlePreview(article, 200), 200);
  const published = article.publishedAt ?? article.collectedAt;
  const categoryLabel =
    CATEGORY_LABEL[article.category] ?? article.category;

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description,
    datePublished: published,
    dateModified: article.collectedAt,
    inLanguage: "pt-BR",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(path),
    },
    author: {
      "@type": "Organization",
      name: article.sourceName ?? SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: getSiteUrl(),
    },
    articleSection: categoryLabel,
    isAccessibleForFree: true,
    ...(article.url
      ? {
          isBasedOn: article.url,
          citation: article.url,
        }
      : {}),
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: getSiteUrl(),
    description: SITE_DESCRIPTION,
    inLanguage: "pt-BR",
    publisher: {
      "@type": "Organization",
      name: "Muttercorp",
      url: getSiteUrl(),
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${getSiteUrl()}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

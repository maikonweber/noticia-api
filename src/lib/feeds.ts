import { fetchArticles, fetchVulnerabilities } from "@/lib/api/client";
import type { Article, Category, Vulnerability } from "@/lib/api/types";
import { CATEGORIES, CATEGORY_LABEL } from "@/lib/categories";
import { getArticlePreview } from "@/lib/articles";
import { vulnHeadline } from "@/lib/vulns";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  absoluteUrl,
  articlePath,
  categoryPath,
} from "@/lib/seo";

/** Feeds públicos (RSS 2.0 e JSON Feed 1.1) gerados a partir da notice-api. */

export const FEED_ITEM_LIMIT = 50;
const CACHE_HEADER = "public, max-age=300, s-maxage=600, stale-while-revalidate=1800";

export type FeedItem = {
  id: string;
  title: string;
  link: string;
  summary: string;
  externalUrl?: string | null;
  author?: string | null;
  category?: string | null;
  date: string;
};

export type FeedChannel = {
  title: string;
  description: string;
  homeUrl: string;
  feedUrl: string;
  jsonFeedUrl?: string;
  items: FeedItem[];
};

// Remove caracteres de controle inválidos em XML 1.0 e escapa entidades.
function xml(text: string | null | undefined): string {
  return (text ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rfc822(iso: string): string {
  const d = new Date(iso);
  return (Number.isNaN(d.getTime()) ? new Date() : d).toUTCString();
}

export function articleToFeedItem(a: Article): FeedItem {
  return {
    id: absoluteUrl(articlePath(a.id)),
    title: a.title,
    link: absoluteUrl(articlePath(a.id)),
    summary: getArticlePreview(a, 400),
    externalUrl: a.url,
    author: a.sourceName,
    category: CATEGORY_LABEL[a.category] ?? a.category,
    date: a.publishedAt ?? a.collectedAt,
  };
}

export function vulnToFeedItem(v: Vulnerability): FeedItem {
  const path = `/vulnerabilidades/${encodeURIComponent(v.vulnId)}`;
  const score = v.cvssScore != null ? ` · CVSS ${v.cvssScore}` : "";
  const kev = v.kev ? " · EXPLORADA (CISA KEV)" : "";
  const headline = vulnHeadline(v);
  const desc = (v.description || "").replace(/\s+/g, " ").trim();
  return {
    id: absoluteUrl(path),
    title: `${v.vulnId} [${v.severity}${score}]${kev} — ${headline}`.slice(0, 300),
    link: absoluteUrl(path),
    summary: desc.length > 600 ? `${desc.slice(0, 597)}…` : desc || headline,
    externalUrl: v.vulnId.startsWith("CVE-")
      ? `https://nvd.nist.gov/vuln/detail/${v.vulnId}`
      : null,
    author: v.sources.join(", ") || null,
    category: v.severity,
    date: v.publishedAt ?? v.lastModifiedAt ?? v.firstSeenAt,
  };
}

export function renderRss(ch: FeedChannel): string {
  const lastBuild = ch.items[0]?.date ?? new Date().toISOString();
  const items = ch.items
    .map((it) => {
      const source = it.externalUrl
        ? `\n\n${it.author ? `Fonte: ${it.author} — ` : ""}${it.externalUrl}`
        : "";
      return `    <item>
      <title>${xml(it.title)}</title>
      <link>${xml(it.link)}</link>
      <guid isPermaLink="true">${xml(it.id)}</guid>
      <pubDate>${rfc822(it.date)}</pubDate>${
        it.category ? `\n      <category>${xml(it.category)}</category>` : ""
      }${it.author ? `\n      <dc:creator>${xml(it.author)}</dc:creator>` : ""}${
        it.externalUrl ? `\n      <source url="${xml(it.externalUrl)}">${xml(it.author || "Fonte original")}</source>` : ""
      }
      <description>${xml(it.summary + source)}</description>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${xml(ch.title)}</title>
    <link>${xml(ch.homeUrl)}</link>
    <description>${xml(ch.description)}</description>
    <language>pt-BR</language>
    <generator>${xml(SITE_NAME)} — MutterCorp</generator>
    <ttl>15</ttl>
    <lastBuildDate>${rfc822(lastBuild)}</lastBuildDate>
    <atom:link href="${xml(ch.feedUrl)}" rel="self" type="application/rss+xml"/>
    <image>
      <url>${xml(absoluteUrl("/icon-192.png"))}</url>
      <title>${xml(ch.title)}</title>
      <link>${xml(ch.homeUrl)}</link>
    </image>
${items}
  </channel>
</rss>
`;
}

export function renderJsonFeed(ch: FeedChannel) {
  return {
    version: "https://jsonfeed.org/version/1.1",
    title: ch.title,
    home_page_url: ch.homeUrl,
    feed_url: ch.jsonFeedUrl ?? ch.feedUrl,
    description: ch.description,
    language: "pt-BR",
    icon: absoluteUrl("/icon-512.png"),
    favicon: absoluteUrl("/icon-192.png"),
    items: ch.items.map((it) => ({
      id: it.id,
      url: it.link,
      external_url: it.externalUrl ?? undefined,
      title: it.title,
      content_text: it.summary,
      date_published: new Date(it.date).toISOString(),
      authors: it.author ? [{ name: it.author }] : undefined,
      tags: it.category ? [it.category] : undefined,
    })),
  };
}

export function rssResponse(ch: FeedChannel): Response {
  return new Response(renderRss(ch), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": CACHE_HEADER,
    },
  });
}

export function jsonFeedResponse(ch: FeedChannel): Response {
  return new Response(JSON.stringify(renderJsonFeed(ch)), {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
      "Cache-Control": CACHE_HEADER,
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export function feedErrorResponse(): Response {
  return new Response("Feed temporariamente indisponível", {
    status: 503,
    headers: { "Content-Type": "text/plain; charset=utf-8", "Retry-After": "120" },
  });
}

export function isCategory(slug: string): slug is Category {
  return CATEGORIES.some((c) => c.id === slug);
}

export async function buildAllNewsChannel(): Promise<FeedChannel> {
  const res = await fetchArticles({ page: 1, limit: FEED_ITEM_LIMIT });
  return {
    title: `${SITE_NAME} — Todas as notícias`,
    description: SITE_DESCRIPTION,
    homeUrl: absoluteUrl("/"),
    feedUrl: absoluteUrl("/feed.xml"),
    jsonFeedUrl: absoluteUrl("/feed.json"),
    items: res.items.map(articleToFeedItem),
  };
}

export async function buildCategoryChannel(category: Category): Promise<FeedChannel> {
  const cat = CATEGORIES.find((c) => c.id === category);
  const res = await fetchArticles({ category, page: 1, limit: FEED_ITEM_LIMIT });
  const base = categoryPath(category);
  return {
    title: `${SITE_NAME} — ${cat?.label ?? category}`,
    description: cat ? `Notícias de ${cat.label}: ${cat.description}.` : SITE_DESCRIPTION,
    homeUrl: absoluteUrl(base),
    feedUrl: absoluteUrl(`${base}/feed.xml`),
    jsonFeedUrl: absoluteUrl(`${base}/feed.json`),
    items: res.items.map(articleToFeedItem),
  };
}

const SEVERITIES = ["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const;

export async function buildVulnChannel(params: {
  severity?: string | null;
  kev?: boolean;
}): Promise<FeedChannel> {
  const severity = (params.severity || "")
    .toUpperCase()
    .split(",")
    .map((s) => s.trim())
    .filter((s): s is (typeof SEVERITIES)[number] =>
      (SEVERITIES as readonly string[]).includes(s),
    );
  const res = await fetchVulnerabilities({
    severity: severity.length ? severity.join(",") : undefined,
    kev: params.kev || undefined,
    sort: params.kev ? "kev" : "published",
    page: 1,
    limit: FEED_ITEM_LIMIT,
  });
  const qs = new URLSearchParams();
  if (severity.length) qs.set("severity", severity.join(","));
  if (params.kev) qs.set("kev", "1");
  const suffix = qs.toString() ? `?${qs}` : "";
  const label = [
    params.kev ? "exploradas ativamente (CISA KEV)" : null,
    severity.length ? `severidade ${severity.join("/")}` : null,
  ]
    .filter(Boolean)
    .join(", ");
  return {
    title: `${SITE_NAME} — Vulnerabilidades${label ? ` (${label})` : ""}`,
    description:
      "CVEs novas (NVD), vulnerabilidades exploradas ativamente (CISA KEV) e GitHub Security Advisories.",
    homeUrl: absoluteUrl("/vulnerabilidades"),
    feedUrl: absoluteUrl(`/vulnerabilidades/feed.xml${suffix}`),
    items: res.items.map(vulnToFeedItem),
  };
}

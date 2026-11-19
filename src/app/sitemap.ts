import type { MetadataRoute } from "next";
import { fetchArticles } from "@/lib/api/client";
import type { Category } from "@/lib/api/types";
import { CATEGORIES } from "@/lib/categories";
import { absoluteUrl, articlePath, categoryPath } from "@/lib/seo";

const CATEGORY_IDS = CATEGORIES.map((c) => c.id);

async function collectArticleEntries(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const seen = new Set<number>();

  await Promise.all(
    CATEGORY_IDS.map(async (category) => {
      try {
        const res = await fetchArticles({
          category: category as Category,
          page: 1,
          limit: 50,
        });
        for (const article of res.items) {
          if (seen.has(article.id)) continue;
          seen.add(article.id);
          entries.push({
            url: absoluteUrl(articlePath(article.id)),
            lastModified: new Date(
              article.publishedAt ?? article.collectedAt,
            ),
            changeFrequency: "hourly",
            priority: 0.7,
          });
        }
      } catch {
        /* categoria indisponível — sitemap parcial */
      }
    }),
  );

  return entries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1,
    },
    ...CATEGORIES.map((cat) => ({
      url: absoluteUrl(categoryPath(cat.id)),
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: 0.9,
    })),
    {
      url: absoluteUrl("/vulnerabilidades"),
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
  ];

  const articles = await collectArticleEntries();
  return [...staticPages, ...articles];
}

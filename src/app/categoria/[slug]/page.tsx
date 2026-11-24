import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeedView } from "@/components/feed/FeedView";
import { fetchArticles } from "@/lib/api/client";
import type { ArticlesResponse, Category } from "@/lib/api/types";
import { CATEGORIES } from "@/lib/categories";
import { buildCategoryMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ topic?: string }>;
};

const VALID = new Set(CATEGORIES.map((c) => c.id));

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!VALID.has(slug as Category)) {
    return { title: "Categoria não encontrada" };
  }
  const sp = await searchParams;
  if (slug === "animes" && sp.topic === "one-piece") {
    const base = buildCategoryMetadata(slug);
    return {
      ...base,
      title: "One Piece — notícias e spoilers",
      description:
        "Notícias, capítulos e spoilers de One Piece. Títulos com spoiler ficam ocultos até você revelar.",
    };
  }
  return buildCategoryMetadata(slug);
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  if (!VALID.has(slug as Category)) notFound();

  const category = slug as Category;
  const sp = await searchParams;
  const topic = category === "animes" && sp.topic === "one-piece" ? "one-piece" as const : undefined;
  let initialArticles: ArticlesResponse | undefined;
  try {
    initialArticles = await fetchArticles({
      category,
      topic,
      onePiece: topic === "one-piece" || undefined,
      page: 1,
      limit: 20,
    });
  } catch {
    initialArticles = undefined;
  }

  return (
    <FeedView
      key={`${category}:${topic ?? "all"}`}
      category={category}
      topic={topic}
      initialArticles={initialArticles}
    />
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeedView } from "@/components/feed/FeedView";
import type { Category } from "@/lib/api/types";
import { CATEGORIES } from "@/lib/categories";
import { buildCategoryMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

const VALID = new Set(CATEGORIES.map((c) => c.id));

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!VALID.has(slug as Category)) {
    return { title: "Categoria não encontrada" };
  }
  return buildCategoryMetadata(slug);
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  if (!VALID.has(slug as Category)) notFound();

  return <FeedView category={slug as Category} />;
}

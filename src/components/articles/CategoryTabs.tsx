"use client";

import Link from "next/link";
import type { Category } from "@/lib/api/types";
import { CATEGORIES } from "@/lib/categories";
import { categoryPath } from "@/lib/seo";

type Props = {
  value: Category;
};

export function CategoryTabs({ value }: Props) {
  return (
    <nav
      aria-label="Categorias de notícias"
      className="flex flex-wrap gap-2"
    >
      {CATEGORIES.map((cat) => {
        const active = value === cat.id;
        const href = categoryPath(cat.id);
        return (
          <Link
            key={cat.id}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-[var(--accent)] text-[var(--accent-fg)]"
                : "bg-[var(--elevated)] text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {cat.label}
          </Link>
        );
      })}
    </nav>
  );
}

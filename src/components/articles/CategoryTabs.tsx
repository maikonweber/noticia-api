"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Category } from "@/lib/api/types";
import { CATEGORIES } from "@/lib/categories";
import { categoryPath } from "@/lib/seo";

type Props = {
  value: Category;
};

export function CategoryTabs({ value }: Props) {
  const ref = useRef<HTMLElement>(null);

  // No celular a lista rola na horizontal: centraliza a categoria ativa
  useEffect(() => {
    const el = ref.current?.querySelector<HTMLElement>('[aria-current="page"]');
    el?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [value]);

  return (
    <nav
      ref={ref}
      aria-label="Categorias de notícias"
      className="no-scrollbar -mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
    >
      {CATEGORIES.map((cat) => {
        const active = value === cat.id;
        const href = categoryPath(cat.id);
        return (
          <Link
            key={cat.id}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 snap-start whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
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

"use client";

import type { Category } from "@/lib/api/types";
import { CATEGORIES } from "@/lib/categories";

type Props = {
  value: Category;
  onChange: (category: Category) => void;
};

export function CategoryTabs({ value, onChange }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Categorias"
      className="flex flex-wrap gap-2"
    >
      {CATEGORIES.map((cat) => {
        const active = value === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(cat.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-[var(--accent)] text-[var(--accent-fg)]"
                : "bg-[var(--elevated)] text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}

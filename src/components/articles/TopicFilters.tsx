"use client";

import Link from "next/link";
import { categoryPath } from "@/lib/seo";

type Props = {
  topic?: "one-piece";
};

const OPTIONS: { id: undefined | "one-piece"; label: string; hint: string }[] = [
  { id: undefined, label: "Todas", hint: "Todos os animes" },
  { id: "one-piece", label: "One Piece", hint: "Só matérias de One Piece, inclusive spoilers" },
];

export function TopicFilters({ topic }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Filtro de animes"
      className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
    >
      {OPTIONS.map((opt) => {
        const active = topic === opt.id;
        const href =
          opt.id === "one-piece"
            ? `${categoryPath("animes")}?topic=one-piece`
            : categoryPath("animes");
        return (
          <Link
            key={opt.label}
            href={href}
            role="tab"
            aria-selected={active}
            title={opt.hint}
            className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              active
                ? "border-amber-500 bg-amber-500 text-black shadow-sm"
                : "border-[var(--border)] bg-[var(--elevated)] text-[var(--muted)] hover:border-amber-500/50 hover:text-[var(--foreground)]"
            }`}
          >
            {opt.label}
          </Link>
        );
      })}
    </div>
  );
}

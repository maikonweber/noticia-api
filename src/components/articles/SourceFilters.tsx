"use client";

import type { Source } from "@/lib/api/types";

type Props = {
  sources: Source[];
  selected: string | undefined;
  onChange: (sourceName: string | undefined) => void;
  loading?: boolean;
};

export function SourceFilters({
  sources,
  selected,
  onChange,
  loading,
}: Props) {
  if (loading) {
    return (
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-24 animate-pulse rounded-full bg-[var(--elevated)]"
          />
        ))}
      </div>
    );
  }

  if (sources.length === 0) return null;

  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
      <button
        type="button"
        onClick={() => onChange(undefined)}
        className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-2 text-xs font-medium transition-colors sm:py-1 ${
          !selected
            ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
            : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/40"
        }`}
      >
        Todas as fontes
      </button>
      {sources.map((src) => {
        const active = selected === src.name;
        return (
          <button
            key={src.id}
            type="button"
            onClick={() => onChange(active ? undefined : src.name)}
            className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-2 text-xs font-medium transition-colors sm:py-1 ${
              active
                ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/40"
            }`}
          >
            {src.name}
          </button>
        );
      })}
    </div>
  );
}

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
      <div className="flex flex-wrap gap-2">
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
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange(undefined)}
        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
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
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
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

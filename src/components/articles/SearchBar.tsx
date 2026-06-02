"use client";

import { useEffect, useState } from "react";

type Props = {
  value: string;
  onChange: (q: string) => void;
};

export function SearchBar({ value, onChange }: Props) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (draft !== value) onChange(draft);
    }, 400);
    return () => clearTimeout(t);
  }, [draft, value, onChange]);

  return (
    <div className="relative">
      <input
        type="search"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Buscar no título…"
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-4 text-sm outline-none ring-[var(--accent)] placeholder:text-[var(--muted)] focus:ring-2"
        aria-label="Buscar notícias"
      />
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
}

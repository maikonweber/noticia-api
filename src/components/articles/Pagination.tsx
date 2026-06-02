"use client";

type Props = {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  page,
  totalPages,
  total,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  const pages = buildPageRange(page, totalPages);

  return (
    <nav
      className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between"
      aria-label="Paginação"
    >
      <p className="text-sm text-[var(--muted)]">
        {total} notícia{total !== 1 ? "s" : ""} · página {page} de {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <PageButton
          label="Anterior"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        />
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="px-2 text-[var(--muted)]">
              …
            </span>
          ) : (
            <PageButton
              key={p}
              label={String(p)}
              active={p === page}
              onClick={() => onPageChange(p)}
            />
          ),
        )}
        <PageButton
          label="Próxima"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        />
      </div>
    </nav>
  );
}

function PageButton({
  label,
  disabled,
  active,
  onClick,
}: {
  label: string;
  disabled?: boolean;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`min-w-[2.25rem] rounded-lg px-2.5 py-1.5 text-sm transition-colors disabled:opacity-40 ${
        active
          ? "bg-[var(--accent)] font-medium text-[var(--accent-fg)]"
          : "text-[var(--muted)] hover:bg-[var(--elevated)] hover:text-[var(--foreground)]"
      }`}
    >
      {label}
    </button>
  );
}

function buildPageRange(
  current: number,
  total: number,
): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  for (
    let p = Math.max(2, current - 1);
    p <= Math.min(total - 1, current + 1);
    p++
  ) {
    pages.push(p);
  }
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

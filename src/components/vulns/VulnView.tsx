"use client";

import { useEffect, useState } from "react";
import { ErrorState } from "@/components/articles/ErrorState";
import { LoadMore } from "@/components/ui/LoadMore";
import { Spinner } from "@/components/ui/Spinner";
import { useInfiniteVulnerabilities, useVulnerabilityStats } from "@/lib/api/hooks";
import type {
  VulnerabilitiesQuery,
  VulnerabilitiesResponse,
  VulnerabilityStats,
  VulnSeverity,
} from "@/lib/api/types";
import {
  formatDate,
  SEVERITY_CLASS,
  SEVERITY_LABEL,
  SEVERITY_ORDER,
} from "@/lib/vulns";
import { VulnCard } from "./VulnCard";

type Sort = NonNullable<VulnerabilitiesQuery["sort"]>;

const SORTS: { id: Sort; label: string }[] = [
  { id: "modified", label: "Últimas atualizações" },
  { id: "published", label: "Recém-publicadas" },
  { id: "score", label: "Maior CVSS" },
  { id: "kev", label: "Entrada no KEV" },
];

type Props = {
  initialList?: VulnerabilitiesResponse;
  initialStats?: VulnerabilityStats;
};

type FiltersProps = {
  severity: VulnSeverity[];
  toggleSeverity: (s: VulnSeverity) => void;
  kev: boolean;
  setKev: (v: boolean) => void;
  sort: Sort;
  setSort: (s: Sort) => void;
  countFor: (s: VulnSeverity) => number | null;
  big?: boolean;
};

function Filters({ severity, toggleSeverity, kev, setKev, sort, setSort, countFor, big }: FiltersProps) {
  const chip = big ? "min-h-11 px-4 text-sm" : "px-3 py-1.5 text-xs";
  return (
    <div className={big ? "space-y-5" : "flex flex-wrap items-center gap-2"}>
      <div className={big ? "space-y-2" : "contents"}>
        {big && <p className="eyebrow">Severidade</p>}
        <div className={big ? "flex flex-wrap gap-2" : "contents"}>
          {SEVERITY_ORDER.map((s) => {
            const active = severity.includes(s);
            const n = countFor(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleSeverity(s)}
                aria-pressed={active}
                className={`rounded-full font-medium transition ${chip} ${
                  active
                    ? SEVERITY_CLASS[s]
                    : "bg-[var(--elevated)] text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {SEVERITY_LABEL[s]}
                {n != null && <span className="ml-1 opacity-75">({n.toLocaleString("pt-BR")})</span>}
              </button>
            );
          })}
        </div>
      </div>
      <div className={big ? "space-y-2" : "contents"}>
        {big && <p className="eyebrow">Exploração</p>}
        <button
          type="button"
          onClick={() => setKev(!kev)}
          aria-pressed={kev}
          className={`rounded-full font-medium transition ${chip} ${
            kev
              ? "bg-red-600 text-white"
              : "border border-red-500/50 text-red-600 hover:bg-red-500/10 dark:text-red-400"
          }`}
        >
          Só exploradas (KEV)
        </button>
      </div>
      <div className={big ? "space-y-2" : "ml-auto"}>
        {big && <p className="eyebrow">Ordenar por</p>}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className={`rounded-lg border border-[var(--border)] bg-[var(--surface)] ${big ? "min-h-12 w-full px-3 text-base" : "px-3 py-1.5 text-xs"}`}
          aria-label="Ordenar"
        >
          {SORTS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function VulnView({ initialList, initialStats }: Props) {
  const [draft, setDraft] = useState("");
  const [q, setQ] = useState("");
  const [severity, setSeverity] = useState<VulnSeverity[]>([]);
  const [kev, setKev] = useState(false);
  const [sort, setSort] = useState<Sort>("modified");
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (draft.trim() !== q) setQ(draft.trim());
    }, 400);
    return () => clearTimeout(t);
  }, [draft, q]);

  useEffect(() => {
    if (!sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sheetOpen]);

  const params: Omit<VulnerabilitiesQuery, "page"> = {
    q: q || undefined,
    severity: severity.length ? severity.join(",") : undefined,
    kev: kev || undefined,
    sort,
    limit: 20,
  };
  const isDefault = !q && severity.length === 0 && !kev && sort === "modified";

  const list = useInfiniteVulnerabilities(params, {
    initialData: isDefault ? initialList : undefined,
  });
  const stats = useVulnerabilityStats({ initialData: initialStats });
  const pages = list.data?.pages ?? [];
  const total = pages[0]?.total ?? 0;
  const items = pages.flatMap((p) => p.items);

  const toggleSeverity = (s: VulnSeverity) =>
    setSeverity((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const countFor = (s: VulnSeverity) =>
    stats.data ? (stats.data.bySeverity.find((b) => b.severity === s)?.count ?? 0) : null;

  const activeFilters = severity.length + (kev ? 1 : 0) + (sort !== "modified" ? 1 : 0);
  const filterProps = { severity, toggleSeverity, kev, setKev, sort, setSort, countFor };
  const lastSync = stats.data?.sync.map((s) => s.lastSuccessAt).filter(Boolean).sort().pop() ?? null;

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="space-y-4">
        <div>
          <h1 className="text-[1.6rem] font-bold leading-tight tracking-tight sm:text-3xl">
            Vulnerabilidades (CVEs)
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            CVEs novas e atualizadas da NVD, exploradas ativamente (CISA KEV) e GitHub
            Security Advisories. Sincronizado a cada 2 horas.
          </p>
        </div>

        {stats.data && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            <Stat label="CVEs monitoradas" value={stats.data.total} />
            <Stat label="Exploradas (KEV)" value={stats.data.kev} />
            <Stat label="Atualizadas em 24h" value={stats.data.updated24h} />
            <Stat label="Última sincronização" value={formatDate(lastSync)} small />
          </div>
        )}

        <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-30 -mx-4 flex gap-2 bg-[var(--background)]/90 px-4 py-2 backdrop-blur sm:static sm:mx-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
          <input
            type="search"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            enterKeyHint="search"
            autoCapitalize="characters"
            placeholder="CVE-2026-1234, fornecedor, produto…"
            className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-base outline-none ring-[var(--accent)] placeholder:text-[var(--muted)] focus:ring-2 sm:py-2.5 sm:text-sm"
            aria-label="Buscar vulnerabilidades"
          />
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="relative inline-flex min-h-12 shrink-0 items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-medium sm:hidden"
            aria-haspopup="dialog"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" d="M4 6h16M7 12h10M10 18h4" />
            </svg>
            Filtros
            {activeFilters > 0 && (
              <span className="ml-0.5 rounded-full bg-[var(--accent)] px-1.5 text-xs text-[var(--accent-fg)]">
                {activeFilters}
              </span>
            )}
          </button>
        </div>

        <div className="hidden sm:block">
          <Filters {...filterProps} />
        </div>
      </section>

      <section className="space-y-4" aria-label="Lista de vulnerabilidades">
        {list.isLoading && (
          <div className="flex justify-center py-20">
            <Spinner className="h-8 w-8" />
          </div>
        )}
        {list.isError && <ErrorState onRetry={() => list.refetch()} />}
        {list.isSuccess && total === 0 && (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-12 text-center text-sm text-[var(--muted)]">
            Nenhuma vulnerabilidade encontrada com esses filtros.
          </div>
        )}
        {list.isSuccess && total > 0 && (
          <>
            <p className="text-xs text-[var(--muted)]">
              {total.toLocaleString("pt-BR")} vulnerabilidade{total === 1 ? "" : "s"} encontrada
              {total === 1 ? "" : "s"}
            </p>
            <div className="grid gap-3">
              {items.map((v) => (
                <VulnCard key={v.id} v={v} />
              ))}
            </div>
            <LoadMore
              hasMore={Boolean(list.hasNextPage)}
              loading={list.isFetchingNextPage}
              onLoad={() => list.fetchNextPage()}
              shown={items.length}
              total={total}
              noun="vulnerabilidades"
            />
          </>
        )}
      </section>

      {sheetOpen && (
        <div className="fixed inset-0 z-[60] sm:hidden" role="dialog" aria-modal="true" aria-label="Filtros">
          <button
            type="button"
            aria-label="Fechar filtros"
            className="absolute inset-0 bg-black/50"
            onClick={() => setSheetOpen(false)}
          />
          <div className="sheet-up absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-3xl border-t border-[var(--border)] bg-[var(--surface)] px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 shadow-2xl">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[var(--border-strong)]" aria-hidden />
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Filtros</h2>
              {activeFilters > 0 && (
                <button
                  type="button"
                  className="min-h-10 px-2 text-sm text-[var(--accent)]"
                  onClick={() => {
                    setSeverity([]);
                    setKev(false);
                    setSort("modified");
                  }}
                >
                  Limpar
                </button>
              )}
            </div>
            <Filters {...filterProps} big />
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              className="mt-6 flex min-h-12 w-full items-center justify-center rounded-xl bg-[var(--accent)] text-sm font-semibold text-[var(--accent-fg)]"
            >
              {list.isFetching ? "Ver resultados" : `Ver ${total.toLocaleString("pt-BR")} resultados`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, small }: { label: string; value: number | string; small?: boolean }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
      <p className="text-[10px] uppercase tracking-wide text-[var(--muted)] sm:text-[11px]">{label}</p>
      <p className={`mt-1 font-bold ${small ? "text-sm leading-snug sm:text-base" : "text-lg"}`}>
        {typeof value === "number" ? value.toLocaleString("pt-BR") : value}
      </p>
    </div>
  );
}

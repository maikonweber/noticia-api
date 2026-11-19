"use client";

import { useEffect, useState } from "react";
import { ErrorState } from "@/components/articles/ErrorState";
import { Pagination } from "@/components/articles/Pagination";
import { Spinner } from "@/components/ui/Spinner";
import { useVulnerabilities, useVulnerabilityStats } from "@/lib/api/hooks";
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

export function VulnView({ initialList, initialStats }: Props) {
  const [draft, setDraft] = useState("");
  const [q, setQ] = useState("");
  const [severity, setSeverity] = useState<VulnSeverity[]>([]);
  const [kev, setKev] = useState(false);
  const [sort, setSort] = useState<Sort>("modified");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => {
      if (draft.trim() !== q) {
        setQ(draft.trim());
        setPage(1);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [draft, q]);

  const params: VulnerabilitiesQuery = {
    q: q || undefined,
    severity: severity.length ? severity.join(",") : undefined,
    kev: kev || undefined,
    sort,
    page,
    limit: 20,
  };
  const isDefault =
    !q && severity.length === 0 && !kev && sort === "modified" && page === 1;

  const list = useVulnerabilities(params, {
    initialData: isDefault ? initialList : undefined,
  });
  const stats = useVulnerabilityStats({ initialData: initialStats });

  const toggleSeverity = (s: VulnSeverity) => {
    setSeverity((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
    setPage(1);
  };

  const countFor = (s: VulnSeverity) =>
    stats.data?.bySeverity.find((b) => b.severity === s)?.count ?? 0;

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Vulnerabilidades (CVEs)
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            CVEs novas e atualizadas da NVD, vulnerabilidades exploradas
            ativamente (CISA KEV) e GitHub Security Advisories. Sincronizado
            automaticamente a cada 2 horas.
          </p>
        </div>

        {stats.data && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="CVEs monitoradas" value={stats.data.total} />
            <Stat label="Exploradas (KEV)" value={stats.data.kev} />
            <Stat label="Atualizadas em 24h" value={stats.data.updated24h} />
            <Stat
              label="Última sincronização"
              value={formatDate(
                stats.data.sync
                  .map((s) => s.lastSuccessAt)
                  .filter(Boolean)
                  .sort()
                  .pop() ?? null,
              )}
            />
          </div>
        )}

        <div className="relative">
          <input
            type="search"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Buscar por CVE-2026-1234, GHSA, fornecedor, produto ou texto…"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-4 pr-4 text-sm outline-none ring-[var(--accent)] placeholder:text-[var(--muted)] focus:ring-2"
            aria-label="Buscar vulnerabilidades"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {SEVERITY_ORDER.map((s) => {
            const active = severity.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleSeverity(s)}
                aria-pressed={active}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? SEVERITY_CLASS[s]
                    : "bg-[var(--elevated)] text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {SEVERITY_LABEL[s]}
                {stats.data && (
                  <span className="ml-1 opacity-75">({countFor(s)})</span>
                )}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setKev((k) => !k);
              setPage(1);
            }}
            aria-pressed={kev}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              kev
                ? "bg-red-600 text-white"
                : "border border-red-500/50 text-red-600 hover:bg-red-500/10 dark:text-red-400"
            }`}
          >
            Só exploradas (KEV)
          </button>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as Sort);
              setPage(1);
            }}
            className="ml-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs"
            aria-label="Ordenar"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="space-y-4" aria-label="Lista de vulnerabilidades">
        {list.isLoading && (
          <div className="flex justify-center py-20">
            <Spinner className="h-8 w-8" />
          </div>
        )}
        {list.isError && <ErrorState onRetry={() => list.refetch()} />}
        {list.isSuccess && list.data.total === 0 && (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-12 text-center text-sm text-[var(--muted)]">
            Nenhuma vulnerabilidade encontrada com esses filtros.
          </div>
        )}
        {list.isSuccess && list.data.total > 0 && (
          <>
            <p className="text-xs text-[var(--muted)]">
              {list.data.total.toLocaleString("pt-BR")} vulnerabilidade
              {list.data.total === 1 ? "" : "s"} encontrada
              {list.data.total === 1 ? "" : "s"}
            </p>
            <div className="grid gap-3">
              {list.data.items.map((v) => (
                <VulnCard key={v.id} v={v} />
              ))}
            </div>
            <Pagination
              page={list.data.page}
              totalPages={list.data.totalPages}
              total={list.data.total}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
      <p className="text-[11px] uppercase tracking-wide text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-1 text-lg font-bold">
        {typeof value === "number" ? value.toLocaleString("pt-BR") : value}
      </p>
    </div>
  );
}

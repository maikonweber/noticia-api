"use client";

import { ErrorState } from "@/components/articles/ErrorState";
import { Spinner } from "@/components/ui/Spinner";
import { useStats } from "@/lib/api/hooks";
import { CATEGORY_LABEL } from "@/lib/categories";

export function StatsDashboard() {
  const { data, isLoading, isError, refetch } = useStats();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  const maxCategory = Math.max(...data.byCategory.map((c) => c.count), 1);
  const maxSource = Math.max(...data.bySource.map((s) => s.count), 1);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="mb-6 text-lg font-semibold">Por categoria</h2>
        <ul className="space-y-4">
          {data.byCategory.map((item) => (
            <li key={item.category}>
              <div className="mb-1 flex justify-between text-sm">
                <span>
                  {CATEGORY_LABEL[item.category] ?? item.category}
                </span>
                <span className="font-mono text-[var(--muted)]">
                  {item.count}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--elevated)]">
                <div
                  className="h-full rounded-full bg-[var(--accent)] transition-all"
                  style={{
                    width: `${(item.count / maxCategory) * 100}%`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="mb-6 text-lg font-semibold">Top fontes</h2>
        <ul className="space-y-4">
          {data.bySource.map((item) => (
            <li key={item.sourceName}>
              <div className="mb-1 flex justify-between gap-2 text-sm">
                <span className="truncate">{item.sourceName}</span>
                <span className="shrink-0 font-mono text-[var(--muted)]">
                  {item.count}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--elevated)]">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{
                    width: `${(item.count / maxSource) * 100}%`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
        {data.bySource.length === 0 && (
          <p className="text-sm text-[var(--muted)]">Nenhuma fonte ainda.</p>
        )}
      </section>
    </div>
  );
}

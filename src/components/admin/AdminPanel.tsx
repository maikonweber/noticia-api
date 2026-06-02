"use client";

import { useRef, useState } from "react";
import { ErrorState } from "@/components/articles/ErrorState";
import { Spinner } from "@/components/ui/Spinner";
import { useIngestion } from "@/lib/api/hooks";
import type { Category, IngestionResult } from "@/lib/api/types";
import { CATEGORIES } from "@/lib/categories";

const COOLDOWN_MS = 60_000;

export function AdminPanel() {
  const [category, setCategory] = useState<Category | "">("");
  const [lastResult, setLastResult] = useState<IngestionResult | null>(null);
  const lastRunRef = useRef(0);
  const [cooldownLeft, setCooldownLeft] = useState(0);

  const mutation = useIngestion();

  const handleRun = async () => {
    const now = Date.now();
    if (now - lastRunRef.current < COOLDOWN_MS) {
      setCooldownLeft(
        Math.ceil((COOLDOWN_MS - (now - lastRunRef.current)) / 1000),
      );
      return;
    }
    lastRunRef.current = now;
    setCooldownLeft(COOLDOWN_MS / 1000);

    const timer = setInterval(() => {
      const left = Math.ceil(
        (COOLDOWN_MS - (Date.now() - lastRunRef.current)) / 1000,
      );
      setCooldownLeft(Math.max(0, left));
      if (left <= 0) clearInterval(timer);
    }, 500);

    try {
      const result = await mutation.mutateAsync({
        ensureSources: true,
        category: category || undefined,
      });
      setLastResult(result);
    } catch {
      setLastResult(null);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-800 dark:text-amber-200">
        Use com moderação. A ingestão dispara várias requisições HTTP no
        servidor e pode demorar. Rate limit local: 1 execução por minuto.
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
        <label className="block text-sm font-medium">
          Categoria (opcional)
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category | "")}
            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--elevated)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            <option value="">Todas</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={handleRun}
          disabled={mutation.isPending || cooldownLeft > 0}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] py-3 text-sm font-semibold text-[var(--accent-fg)] disabled:opacity-50"
        >
          {mutation.isPending && <Spinner className="h-4 w-4 border-[var(--accent-fg)]/30 border-t-[var(--accent-fg)]" />}
          {mutation.isPending
            ? "Coletando…"
            : cooldownLeft > 0
              ? `Aguarde ${cooldownLeft}s`
              : "Atualizar agora"}
        </button>

        {mutation.isError && (
          <ErrorState message="Falha ao executar ingestão." />
        )}
      </div>

      {lastResult && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-sm">
          <h3 className="mb-3 font-semibold">Último resultado</h3>
          <dl className="grid grid-cols-2 gap-2">
            <dt className="text-[var(--muted)]">Fontes processadas</dt>
            <dd className="font-mono">{lastResult.processedSources}</dd>
            <dt className="text-[var(--muted)]">Coletadas</dt>
            <dd className="font-mono">{lastResult.collected}</dd>
            <dt className="text-[var(--muted)]">Inseridas</dt>
            <dd className="font-mono">{lastResult.inserted}</dd>
          </dl>
          {lastResult.failures.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 font-medium text-red-600 dark:text-red-400">
                Falhas ({lastResult.failures.length})
              </p>
              <ul className="max-h-40 space-y-2 overflow-y-auto text-xs text-[var(--muted)]">
                {lastResult.failures.map((f, i) => (
                  <li key={i}>
                    <span className="block truncate">{f.source}</span>
                    <span className="text-red-500">{f.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

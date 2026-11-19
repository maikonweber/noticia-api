"use client";

import { useEffect, useRef } from "react";
import { Spinner } from "./Spinner";

/** Botão "Carregar mais" que também dispara sozinho ao chegar perto do fim (rolagem infinita). */
export function LoadMore({
  hasMore,
  loading,
  onLoad,
  shown,
  total,
  noun = "notícias",
}: {
  hasMore: boolean;
  loading: boolean;
  onLoad: () => void;
  shown: number;
  total: number;
  noun?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const autoLoads = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || !hasMore) return;
    const io = new IntersectionObserver(
      (entries) => {
        // Até 5 páginas automáticas; depois só no botão (para o rodapé continuar acessível)
        if (entries[0]?.isIntersecting && !loading && autoLoads.current < 5) {
          autoLoads.current += 1;
          onLoad();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loading, onLoad]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-2 py-4">
      <p className="text-xs text-[var(--muted)]">
        {shown.toLocaleString("pt-BR")} de {total.toLocaleString("pt-BR")} {noun}
      </p>
      {hasMore && (
        <button
          type="button"
          onClick={onLoad}
          disabled={loading}
          className="inline-flex min-h-12 w-full max-w-xs items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 text-sm font-medium hover:border-[var(--accent)] disabled:opacity-60"
        >
          {loading ? <Spinner className="h-4 w-4" /> : null}
          {loading ? "Carregando…" : "Carregar mais"}
        </button>
      )}
    </div>
  );
}

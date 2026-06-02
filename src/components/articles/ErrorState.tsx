"use client";

export function ErrorState({
  message = "Não foi possível carregar os dados. A API pode estar temporariamente indisponível.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-red-500/30 bg-red-500/5 px-6 py-10 text-center">
      <p className="mb-4 text-sm text-red-600 dark:text-red-400">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg border border-red-500/40 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-500/10 dark:text-red-400"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}

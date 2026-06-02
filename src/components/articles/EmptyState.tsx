import Link from "next/link";

export function EmptyState({ showAdminLink }: { showAdminLink?: boolean }) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--elevated)] text-2xl">
        📭
      </div>
      <h3 className="mb-2 text-lg font-semibold">Aguardando coleta</h3>
      <p className="mx-auto max-w-md text-sm leading-relaxed text-[var(--muted)]">
        Ainda não há notícias nesta categoria. O worker coleta automaticamente
        a cada 30 minutos — volte em breve ou dispare uma ingestão manual no
        painel admin.
      </p>
      {showAdminLink && (
        <Link
          href="/admin"
          className="mt-6 inline-flex rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-fg)] hover:opacity-90"
        >
          Ir para Admin
        </Link>
      )}
    </div>
  );
}

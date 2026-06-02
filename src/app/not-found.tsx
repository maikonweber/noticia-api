import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="mb-2 text-6xl font-bold text-[var(--muted)]">404</p>
      <h1 className="mb-2 text-xl font-semibold">Página não encontrada</h1>
      <p className="mb-8 max-w-sm text-sm text-[var(--muted)]">
        O conteúdo que você procura não existe ou foi removido.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-fg)]"
      >
        Ir para o feed
      </Link>
    </div>
  );
}

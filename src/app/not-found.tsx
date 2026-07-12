import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { categoryPath, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Página não encontrada",
  description: `A página solicitada não existe no ${SITE_NAME}. Volte ao feed de notícias.`,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="mb-2 text-6xl font-bold text-[var(--muted)]">404</p>
      <h1 className="mb-2 text-xl font-semibold">Página não encontrada</h1>
      <p className="mb-8 max-w-sm text-sm text-[var(--muted)]">
        O conteúdo que você procura não existe ou foi removido.
      </p>
      <Link
        href={categoryPath("tecnologia")}
        className="mb-10 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-fg)]"
      >
        Ir para o feed
      </Link>
      <nav aria-label="Categorias" className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={categoryPath(cat.id)}
            className="rounded-full bg-[var(--elevated)] px-3 py-1.5 text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            {cat.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { categoryPath, SITE_NAME } from "@/lib/seo";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]/60">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="text-sm font-semibold tracking-tight">{SITE_NAME}</p>
          <p className="mt-2 max-w-sm text-xs leading-relaxed text-[var(--muted)]">
            Agregador de notícias em português por categoria. Conteúdo
            coletado de fontes públicas; links afiliados Shopee quando
            exibidos.
          </p>
        </div>

        <nav aria-label="Categorias de notícias">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Categorias
          </p>
          <ul className="space-y-2 text-sm">
            {CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={categoryPath(cat.id)}
                  className="text-[var(--foreground)] hover:text-[var(--accent)]"
                >
                  Notícias de {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Site">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Site
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-[var(--accent)]">
                Feed principal
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-[var(--accent)]">
                Dashboard
              </Link>
            </li>
            <li>
              <a
                href="https://notice.muttercorp.com.br/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent)]"
              >
                API / Swagger
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-[var(--border)] py-4 text-center text-xs text-[var(--muted)]">
        © {year} {SITE_NAME} · Muttercorp
      </div>
    </footer>
  );
}

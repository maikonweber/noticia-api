import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { categoryPath, SITE_NAME } from "@/lib/seo";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--footer-bg)]">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Link
            href="https://muttercorp.com.br"
            className="inline-flex items-center gap-2.5"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/logo-128.png"
              alt="MutterCorp"
              width={28}
              height={28}
            />
            <span className="font-display text-sm tracking-tight">
              MutterCorp
            </span>
          </Link>
          <p className="mt-3 max-w-sm text-xs leading-relaxed text-[var(--muted)]">
            {SITE_NAME} — agregador de notícias em português por categoria.
            Um produto MutterCorp. Conteúdo coletado de fontes públicas; links
            afiliados Shopee quando exibidos.
          </p>
        </div>

        <nav aria-label="Categorias de notícias">
          <p className="eyebrow mb-3">Categorias</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm md:grid-cols-1">
            {CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={categoryPath(cat.id)}
                  className="text-[var(--foreground)] hover:text-[var(--accent-soft)]"
                >
                  Notícias de {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Site">
          <p className="eyebrow mb-3">Site</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/categoria/tecnologia" className="hover:text-[var(--accent-soft)]">
                Feed principal
              </Link>
            </li>
            <li>
              <Link
                href="/vulnerabilidades"
                className="hover:text-[var(--accent-soft)]"
              >
                Vulnerabilidades (CVEs)
              </Link>
            </li>
            <li>
              <Link
                href="/ofertas"
                className="hover:text-[var(--accent-soft)]"
              >
                Grupos de Ofertas
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="hover:text-[var(--accent-soft)]"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <a
                href="https://notice.muttercorp.com.br/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent-soft)]"
              >
                API / Swagger
              </a>
            </li>
            <li>
              <a
                href="https://muttercorp.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent-soft)]"
              >
                MutterCorp
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-[var(--border)] py-4 text-center text-xs text-[var(--muted)]">
        © {year} MutterCorp · {SITE_NAME}
      </div>
    </footer>
  );
}

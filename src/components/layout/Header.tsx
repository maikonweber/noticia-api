import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { categoryPath, SITE_NAME } from "@/lib/seo";

const links = [
  { href: "/", label: "Feed" },
  { href: "/ofertas", label: "Ofertas" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Header() {
  const showAdmin = process.env.NEXT_PUBLIC_ENABLE_ADMIN === "true";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--header-bg)] backdrop-blur-[18px]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label={`${SITE_NAME} — MutterCorp`}
        >
          <Image
            src="/logo-128.png"
            alt="MutterCorp"
            width={32}
            height={32}
            className="transition-transform group-hover:scale-105"
            priority
          />
          <div className="leading-tight">
            <span className="font-display block text-base tracking-tight text-[var(--foreground)] sm:text-lg">
              MutterCorp
            </span>
            <span className="block text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
              {SITE_NAME} · Notícias
            </span>
          </div>
        </Link>

        <nav
          aria-label="Principal"
          className="flex items-center gap-1 text-sm"
        >
          <div className="mr-1 hidden items-center gap-0.5 md:flex">
            {CATEGORIES.slice(0, 4).map((cat) => (
              <Link
                key={cat.id}
                href={categoryPath(cat.id)}
                className="rounded-md px-2.5 py-1.5 text-xs text-[var(--muted)] transition-colors hover:bg-[var(--elevated)] hover:text-[var(--foreground)]"
              >
                {cat.label}
              </Link>
            ))}
          </div>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--elevated)] hover:text-[var(--foreground)]"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://muttercorp.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-md px-3 py-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--elevated)] hover:text-[var(--accent-soft)] sm:inline"
          >
            Site
          </a>
          {showAdmin && (
            <Link
              href="/admin"
              className="rounded-md px-3 py-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--elevated)] hover:text-[var(--foreground)]"
            >
              Admin
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

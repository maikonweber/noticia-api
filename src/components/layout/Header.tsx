import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { categoryPath, SITE_NAME } from "@/lib/seo";
import { MenuButton } from "./MobileNav";

const links = [
  { href: "/categoria/tecnologia", label: "Feed" },
  { href: "/categoria/animes", label: "Animes" },
  { href: "/vulnerabilidades", label: "CVEs" },
  { href: "/ofertas", label: "Ofertas" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Header() {
  const showAdmin = process.env.NEXT_PUBLIC_ENABLE_ADMIN === "true";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--header-bg)] pt-[env(safe-area-inset-top)] backdrop-blur-[18px]">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <Link
          href="/categoria/tecnologia"
          className="group flex min-w-0 items-center gap-2.5 sm:gap-3"
          aria-label={`${SITE_NAME} — MutterCorp`}
        >
          <Image
            src="/logo-128.png"
            alt="MutterCorp"
            width={32}
            height={32}
            className="shrink-0 transition-transform group-hover:scale-105"
            priority
          />
          <div className="min-w-0 leading-tight">
            <span className="font-display block text-base tracking-tight text-[var(--foreground)] sm:text-lg">
              MutterCorp
            </span>
            <span className="block truncate text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
              {SITE_NAME} · Notícias
            </span>
          </div>
        </Link>

        <nav
          aria-label="Principal"
          className="hidden items-center gap-1 text-sm md:flex"
        >
          <div className="mr-1 hidden items-center gap-0.5 lg:flex">
            {[
              CATEGORIES.find((c) => c.id === "animes"),
              ...CATEGORIES.filter((c) => c.id !== "animes").slice(0, 3),
            ].filter((c): c is (typeof CATEGORIES)[number] => Boolean(c)).map((cat) => (
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
            className="rounded-md px-3 py-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--elevated)] hover:text-[var(--accent-soft)]"
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

        <MenuButton />
      </div>
    </header>
  );
}

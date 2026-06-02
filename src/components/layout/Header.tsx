import Link from "next/link";

const links = [
  { href: "/", label: "Feed" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Header() {
  const showAdmin = process.env.NEXT_PUBLIC_ENABLE_ADMIN === "true";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-sm font-bold text-[var(--accent-fg)]">
            N
          </span>
          <div className="leading-tight">
            <span className="block text-sm font-semibold tracking-tight">
              Notice
            </span>
            <span className="block text-[10px] uppercase tracking-widest text-[var(--muted)]">
              Muttercorp
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--elevated)] hover:text-[var(--foreground)]"
            >
              {link.label}
            </Link>
          ))}
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

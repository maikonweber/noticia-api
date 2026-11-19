"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import { categoryPath } from "@/lib/seo";
import { InstallAppButton } from "@/components/pwa/InstallAppButton";

const OPEN_EVENT = "notice:open-menu";

export function openMobileMenu() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

/** Botão hambúrguer do header (só no celular). */
export function MenuButton() {
  return (
    <button
      type="button"
      onClick={openMobileMenu}
      className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-[var(--foreground)] hover:bg-[var(--elevated)] md:hidden"
      aria-label="Abrir menu"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
        <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    </button>
  );
}

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

const ICONS = {
  home: "M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  shield: "M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3zM9 12l2 2 4-4",
  tag: "M3 12V4a1 1 0 011-1h8l9 9-9 9-9-9zM7.5 7.5h.01",
};

/** Barra inferior fixa + gaveta de categorias (somente < md). */
export function MobileNav() {
  const pathname = usePathname() || "/";
  // A gaveta guarda em qual rota foi aberta: ao navegar ela fecha sozinha
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const setOpen = (v: boolean) => setOpenAt(v ? pathname : null);

  useEffect(() => {
    const onOpen = () => setOpenAt(window.location.pathname);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  // Trava o scroll do body com a gaveta aberta + Esc fecha
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenAt(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isNews = pathname === "/" || pathname.startsWith("/categoria") || pathname.startsWith("/articles");
  const tabs = [
    { key: "home", label: "Notícias", href: "/categoria/tecnologia", active: isNews && !open, icon: ICONS.home },
    { key: "cats", label: "Categorias", onClick: () => setOpen(true), active: open, icon: ICONS.grid },
    { key: "cves", label: "CVEs", href: "/vulnerabilidades", active: pathname.startsWith("/vulnerabilidades") && !open, icon: ICONS.shield },
    { key: "offers", label: "Ofertas", href: "/ofertas", active: pathname.startsWith("/ofertas") && !open, icon: ICONS.tag },
  ];

  return (
    <>
      <nav
        aria-label="Navegação principal (celular)"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-[var(--header-bg)] pb-[env(safe-area-inset-bottom)] backdrop-blur-[18px] md:hidden"
      >
        <ul className="mx-auto grid max-w-md grid-cols-4">
          {tabs.map((t) => {
            const cls = `flex h-16 w-full flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
              t.active ? "text-[var(--accent)]" : "text-[var(--muted)]"
            }`;
            return (
              <li key={t.key}>
                {t.href ? (
                  <Link href={t.href} className={cls} aria-current={t.active ? "page" : undefined}>
                    <Icon d={t.icon} />
                    {t.label}
                  </Link>
                ) : (
                  <button type="button" onClick={t.onClick} className={cls} aria-expanded={open}>
                    <Icon d={t.icon} />
                    {t.label}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {open && (
        <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button
            type="button"
            aria-label="Fechar menu"
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
          <div className="sheet-up absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-3xl border-t border-[var(--border)] bg-[var(--surface)] px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-3 shadow-2xl">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[var(--border-strong)]" aria-hidden />
            <div className="mb-3 flex items-center justify-between">
              <p className="eyebrow">Categorias</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--elevated)]"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>
            <ul className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => {
                const href = categoryPath(cat.id);
                const active = pathname === href;
                return (
                  <li key={cat.id}>
                    <Link
                      href={href}
                      className={`flex min-h-12 items-center rounded-xl px-3 text-sm font-medium ${
                        active
                          ? "bg-[var(--accent)] text-[var(--accent-fg)]"
                          : "bg-[var(--elevated)] text-[var(--foreground)]"
                      }`}
                    >
                      {cat.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <p className="eyebrow mb-3 mt-6">Mais</p>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              <li>
                <Link href="/vulnerabilidades" className="flex min-h-12 items-center rounded-xl border border-[var(--border)] px-3">
                  Vulnerabilidades (CVEs)
                </Link>
              </li>
              <li>
                <Link href="/ofertas" className="flex min-h-12 items-center rounded-xl border border-[var(--border)] px-3">
                  Grupos de ofertas
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="flex min-h-12 items-center rounded-xl border border-[var(--border)] px-3">
                  Dashboard
                </Link>
              </li>
              <li>
                <a href="https://muttercorp.com.br" target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center rounded-xl border border-[var(--border)] px-3">
                  MutterCorp ↗
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <InstallAppButton />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

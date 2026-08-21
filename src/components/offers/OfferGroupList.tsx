"use client";

import { useOfferGroups } from "@/lib/api/hooks";

export function OfferGroupList() {
  const { data, isLoading } = useOfferGroups();
  const groups = data?.items ?? [];

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--elevated)]/40"
          />
        ))}
      </div>
    );
  }

  if (!groups.length) {
    return (
      <p className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-4 py-6 text-sm text-[var(--muted)]">
        Ainda não há grupos públicos. No admin, conecte o WhatsApp e marque um
        grupo como Grupo de Ofertas.
      </p>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {groups.map((group) => (
        <li
          key={group.id}
          className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
        >
          <p className="font-display text-base tracking-tight">{group.name}</p>
          {group.description && (
            <p className="mt-1 flex-1 text-sm leading-relaxed text-[var(--muted)]">
              {group.description}
            </p>
          )}
          <p className="mt-2 text-[11px] uppercase tracking-wide text-[var(--muted)]">
            {group.postsPerRun} ofertas por publicação
          </p>
          <a
            href={group.inviteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center justify-center rounded-xl bg-[#25D366] px-3 py-2 text-sm font-semibold text-[#052e16] transition-opacity hover:opacity-90"
          >
            Entrar no WhatsApp
          </a>
        </li>
      ))}
    </ul>
  );
}

import Link from "next/link";
import type { Vulnerability } from "@/lib/api/types";
import { formatDate, SOURCE_LABEL, vulnHeadline } from "@/lib/vulns";
import { KevBadge, SeverityBadge } from "./SeverityBadge";

export function VulnCard({ v }: { v: Vulnerability }) {
  const affected = [...v.vendors, ...v.products, ...v.packages]
    .filter(Boolean)
    .slice(0, 4);
  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--border-strong)]">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={`/vulnerabilidades/${encodeURIComponent(v.vulnId)}`}
          className="font-mono text-sm font-semibold text-[var(--accent-soft)] hover:underline"
        >
          {v.vulnId}
        </Link>
        <SeverityBadge severity={v.severity} score={v.cvssScore} />
        {v.kev && <KevBadge />}
        {v.updateCount > 0 && (
          <span className="rounded-md bg-[var(--elevated)] px-2 py-0.5 text-xs text-[var(--muted)]">
            atualizada
          </span>
        )}
      </div>
      <h2 className="mt-2 text-sm font-semibold leading-snug">
        <Link
          href={`/vulnerabilidades/${encodeURIComponent(v.vulnId)}`}
          className="hover:underline"
        >
          {vulnHeadline(v)}
        </Link>
      </h2>
      {v.title && v.description && (
        <p className="mt-1 line-clamp-2 text-xs text-[var(--muted)]">
          {v.description}
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[var(--muted)]">
        {affected.length > 0 && <span>Afeta: {affected.join(", ")}</span>}
        <span>Publicada: {formatDate(v.publishedAt, false)}</span>
        <span>Atualizada: {formatDate(v.lastModifiedAt)}</span>
        <span>
          Fontes: {v.sources.map((s) => SOURCE_LABEL[s] ?? s).join(" · ")}
        </span>
      </div>
    </article>
  );
}

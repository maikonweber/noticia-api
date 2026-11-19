import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { KevBadge, SeverityBadge } from "@/components/vulns/SeverityBadge";
import { fetchVulnerability } from "@/lib/api/client";
import type { Vulnerability } from "@/lib/api/types";
import { formatDate, SOURCE_LABEL, vulnHeadline } from "@/lib/vulns";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

async function load(id: string): Promise<Vulnerability | null> {
  try {
    return await fetchVulnerability(decodeURIComponent(id));
  } catch (error) {
    if ((error as { status?: number }).status === 404) return null;
    throw error;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const v = await load(id).catch(() => null);
  if (!v) return { title: "Vulnerabilidade não encontrada" };
  return {
    title: `${v.vulnId}: ${vulnHeadline(v)}`.slice(0, 90),
    description: (v.description || vulnHeadline(v)).slice(0, 158),
    alternates: { canonical: `/vulnerabilidades/${v.vulnId}` },
  };
}

export default async function VulnerabilityPage({ params }: Props) {
  const { id } = await params;
  const v = await load(id);
  if (!v) notFound();

  const isCve = v.vulnId.startsWith("CVE-");
  const officialLinks = [
    isCve && { href: `https://nvd.nist.gov/vuln/detail/${v.vulnId}`, label: "NVD" },
    isCve && { href: `https://www.cve.org/CVERecord?id=${v.vulnId}`, label: "CVE.org" },
    ...v.aliases
      .filter((a) => a.startsWith("GHSA-"))
      .map((a) => ({ href: `https://github.com/advisories/${a}`, label: a })),
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/vulnerabilidades"
        className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
      >
        ← Todas as vulnerabilidades
      </Link>
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-lg font-bold">{v.vulnId}</span>
          <SeverityBadge severity={v.severity} score={v.cvssScore} />
          {v.kev && <KevBadge />}
          {v.status && (
            <span className="rounded-md bg-[var(--elevated)] px-2 py-0.5 text-xs text-[var(--muted)]">
              {v.status}
            </span>
          )}
        </div>
        <h1 className="text-xl font-bold leading-snug sm:text-2xl">
          {vulnHeadline(v)}
        </h1>
      </header>

      {v.description && (
        <p className="whitespace-pre-line text-sm leading-relaxed">
          {v.description}
        </p>
      )}

      {v.kev && (
        <section className="rounded-xl border border-red-500/40 bg-red-500/5 p-4 text-sm">
          <h2 className="font-semibold text-red-600 dark:text-red-400">
            Exploração ativa confirmada (CISA KEV)
          </h2>
          <dl className="mt-2 grid gap-1 sm:grid-cols-2">
            <Row k="Adicionada ao KEV" v={formatDate(v.kevDateAdded, false)} />
            <Row k="Prazo de correção (EUA)" v={formatDate(v.kevDueDate, false)} />
            <Row k="Uso por ransomware" v={v.kevRansomware ?? "—"} />
          </dl>
          {v.kevRequiredAction && (
            <p className="mt-2 text-[var(--muted)]">
              Ação recomendada: {v.kevRequiredAction}
            </p>
          )}
        </section>
      )}

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm">
        <dl className="grid gap-2 sm:grid-cols-2">
          <Row
            k="CVSS"
            v={
              v.cvssScore != null
                ? `${v.cvssScore.toFixed(1)} (v${v.cvssVersion ?? "?"}, ${v.cvssSource === "ghsa" ? "GitHub" : "NVD"})`
                : "Ainda sem nota"
            }
          />
          <Row k="Vetor" v={v.cvssVector ?? "—"} mono />
          <Row k="Publicada" v={formatDate(v.publishedAt)} />
          <Row k="Última modificação" v={formatDate(v.lastModifiedAt)} />
          <Row k="Fornecedores" v={v.vendors.join(", ") || "—"} />
          <Row k="Produtos" v={v.products.join(", ") || "—"} />
          {v.packages.length > 0 && <Row k="Pacotes" v={v.packages.join(", ")} mono />}
          <Row k="CWE" v={v.cwes.join(", ") || "—"} mono />
          <Row k="Fontes" v={v.sources.map((s) => SOURCE_LABEL[s] ?? s).join(" · ")} />
          {v.aliases.length > 1 && <Row k="Aliases" v={v.aliases.join(", ")} mono />}
        </dl>
      </section>

      {(officialLinks.length > 0 || v.references.length > 0) && (
        <section className="space-y-2 text-sm">
          <h2 className="font-semibold">Referências</h2>
          <ul className="space-y-1">
            {officialLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer nofollow" className="text-[var(--accent-soft)] hover:underline">
                  {l.label}
                </a>
              </li>
            ))}
            {v.references.slice(0, 25).map((r) => (
              <li key={r} className="truncate">
                <a href={r} target="_blank" rel="noopener noreferrer nofollow" className="break-all text-[var(--muted)] hover:text-[var(--foreground)] hover:underline">
                  {r}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-[var(--muted)]">{k}</dt>
      <dd className={mono ? "break-all font-mono text-xs" : ""}>{v}</dd>
    </div>
  );
}

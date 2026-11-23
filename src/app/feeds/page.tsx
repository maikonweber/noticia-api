import type { Metadata } from "next";
import { CopyFeedUrl } from "@/components/feeds/CopyFeedUrl";
import { CATEGORIES } from "@/lib/categories";
import { SITE_NAME, absoluteUrl, categoryPath } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Feeds RSS e JSON",
  description:
    "Assine o Notice no seu leitor de RSS (Feedly, Inoreader, NetNewsWire, Thunderbird): feeds por categoria, feed geral e alertas de CVEs críticas e exploradas (CISA KEV).",
  alternates: { canonical: "/feeds" },
  openGraph: { title: `Feeds RSS e JSON · ${SITE_NAME}`, url: "/feeds" },
};

type Row = { title: string; description: string; rss: string; json?: string };

function FeedRow({ row }: { row: Row }) {
  return (
    <li className="flex flex-col gap-3 rounded-xl border border-[var(--border)] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-semibold">{row.title}</p>
        <p className="mt-0.5 text-xs text-[var(--muted)]">{row.description}</p>
        <code className="mt-1 block truncate text-xs text-[var(--muted)]">{row.rss}</code>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <a
          href={row.rss}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--accent)] px-3 text-xs font-semibold text-[var(--accent-fg)] hover:opacity-90"
        >
          RSS
        </a>
        {row.json ? (
          <a
            href={row.json}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--border)] px-3 text-xs font-medium hover:border-[var(--accent)]"
          >
            JSON Feed
          </a>
        ) : null}
        <CopyFeedUrl url={row.rss} />
      </div>
    </li>
  );
}

export default function FeedsPage() {
  const general: Row[] = [
    {
      title: "Todas as notícias",
      description: "As 50 notícias mais recentes de todas as categorias.",
      rss: absoluteUrl("/feed.xml"),
      json: absoluteUrl("/feed.json"),
    },
  ];
  const vulns: Row[] = [
    {
      title: "Vulnerabilidades — todas",
      description: "CVEs recém-publicadas (NVD, GitHub Advisories, CISA KEV).",
      rss: absoluteUrl("/vulnerabilidades/feed.xml"),
    },
    {
      title: "Vulnerabilidades críticas e altas",
      description: "Só CVEs com severidade CRITICAL ou HIGH.",
      rss: absoluteUrl("/vulnerabilidades/feed.xml?severity=CRITICAL,HIGH"),
    },
    {
      title: "Exploradas ativamente (CISA KEV)",
      description: "Vulnerabilidades que a CISA confirmou estarem sendo exploradas.",
      rss: absoluteUrl("/vulnerabilidades/feed.xml?kev=1"),
    },
  ];
  const categories: Row[] = CATEGORIES.map((c) => ({
    title: c.label,
    description: c.description,
    rss: absoluteUrl(`${categoryPath(c.id)}/feed.xml`),
    json: absoluteUrl(`${categoryPath(c.id)}/feed.json`),
  }));

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Assinar</p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Feeds RSS e JSON</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
          Acompanhe o {SITE_NAME} no seu leitor de feeds favorito (Feedly, Inoreader,
          NetNewsWire, Thunderbird…) ou integre em automações. Copie o endereço e cole no
          leitor. Os feeds são atualizados a cada poucos minutos e trazem os 50 itens mais
          recentes, com link para a notícia e para a fonte original.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Geral</h2>
        <ul className="space-y-3">{general.map((r) => <FeedRow key={r.rss} row={r} />)}</ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Segurança / CVEs</h2>
        <ul className="space-y-3">{vulns.map((r) => <FeedRow key={r.rss} row={r} />)}</ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Por categoria</h2>
        <ul className="space-y-3">{categories.map((r) => <FeedRow key={r.rss} row={r} />)}</ul>
      </section>
    </div>
  );
}

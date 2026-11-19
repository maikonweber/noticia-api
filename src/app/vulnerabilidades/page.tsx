import type { Metadata } from "next";
import { VulnView } from "@/components/vulns/VulnView";
import {
  fetchVulnerabilities,
  fetchVulnerabilityStats,
} from "@/lib/api/client";
import type {
  VulnerabilitiesResponse,
  VulnerabilityStats,
} from "@/lib/api/types";
import { SITE_NAME } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vulnerabilidades e CVEs",
  description:
    "CVEs novas e atualizadas (NVD), vulnerabilidades exploradas ativamente (CISA KEV) e GitHub Security Advisories, com severidade CVSS e busca por CVE.",
  alternates: { canonical: "/vulnerabilidades" },
  openGraph: {
    title: `Vulnerabilidades e CVEs · ${SITE_NAME}`,
    url: "/vulnerabilidades",
  },
};

export default async function VulnerabilitiesPage() {
  let initialList: VulnerabilitiesResponse | undefined;
  let initialStats: VulnerabilityStats | undefined;
  try {
    [initialList, initialStats] = await Promise.all([
      fetchVulnerabilities({ sort: "modified", page: 1, limit: 20 }),
      fetchVulnerabilityStats(),
    ]);
  } catch {
    /* API indisponível — o cliente tenta de novo */
  }
  return <VulnView initialList={initialList} initialStats={initialStats} />;
}

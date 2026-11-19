import type { VulnSeverity } from "@/lib/api/types";
import { SEVERITY_CLASS, SEVERITY_LABEL } from "@/lib/vulns";

export function SeverityBadge({
  severity,
  score,
}: {
  severity: VulnSeverity;
  score?: number | null;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${SEVERITY_CLASS[severity] ?? SEVERITY_CLASS.UNKNOWN}`}
      title={`Severidade ${SEVERITY_LABEL[severity] ?? severity}`}
    >
      {SEVERITY_LABEL[severity] ?? severity}
      {score != null && <span className="font-mono">{score.toFixed(1)}</span>}
    </span>
  );
}

export function KevBadge() {
  return (
    <span
      className="inline-flex items-center rounded-md border border-red-500/60 bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-600 dark:text-red-400"
      title="Listada no catálogo CISA Known Exploited Vulnerabilities — exploração ativa confirmada"
    >
      Explorada (KEV)
    </span>
  );
}

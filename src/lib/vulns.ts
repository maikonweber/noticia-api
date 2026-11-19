import type { VulnSeverity } from "./api/types";

export const SEVERITY_ORDER: VulnSeverity[] = [
  "CRITICAL",
  "HIGH",
  "MEDIUM",
  "LOW",
  "UNKNOWN",
];

export const SEVERITY_LABEL: Record<VulnSeverity, string> = {
  CRITICAL: "Crítica",
  HIGH: "Alta",
  MEDIUM: "Média",
  LOW: "Baixa",
  NONE: "Nenhuma",
  UNKNOWN: "Sem nota",
};

export const SEVERITY_CLASS: Record<VulnSeverity, string> = {
  CRITICAL: "bg-red-600 text-white",
  HIGH: "bg-orange-500 text-white",
  MEDIUM: "bg-amber-400 text-black",
  LOW: "bg-emerald-600 text-white",
  NONE: "bg-zinc-500 text-white",
  UNKNOWN: "bg-zinc-500/80 text-white",
};

export const SOURCE_LABEL: Record<string, string> = {
  nvd: "NVD",
  kev: "CISA KEV",
  ghsa: "GitHub Advisory",
};

export function formatDate(iso: string | null | undefined, withTime = true) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    timeZone: "America/Sao_Paulo",
  }).format(d);
}

export function vulnHeadline(v: {
  title: string | null;
  description: string | null;
}) {
  if (v.title) return v.title;
  const text = (v.description || "").replace(/\s+/g, " ").trim();
  if (!text) return "Sem descrição";
  return text.length > 140 ? `${text.slice(0, 137)}…` : text;
}

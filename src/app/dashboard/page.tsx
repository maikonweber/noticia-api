import type { Metadata } from "next";
import { StatsDashboard } from "@/components/stats/StatsDashboard";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Resumo de volume por categoria e principais fontes.
        </p>
      </div>
      <StatsDashboard />
    </div>
  );
}

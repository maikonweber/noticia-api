import type { Metadata } from "next";
import { HighValueGrid } from "@/components/banners/HighValueGrid";
import { SidebarBanner } from "@/components/banners/SidebarBanner";
import { StatsDashboard } from "@/components/stats/StatsDashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
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

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start lg:gap-8">
        <div className="min-w-0 space-y-8">
          <StatsDashboard />
          <HighValueGrid limit={8} />
        </div>
        <aside className="mt-8 hidden lg:mt-0 lg:block">
          <SidebarBanner limit={3} title="Ofertas notebook" />
        </aside>
      </div>
    </div>
  );
}

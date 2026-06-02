import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPanel } from "@/components/admin/AdminPanel";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  if (process.env.NEXT_PUBLIC_ENABLE_ADMIN !== "true") {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Ingestão manual de notícias via API.
        </p>
      </div>
      <AdminPanel />
    </div>
  );
}

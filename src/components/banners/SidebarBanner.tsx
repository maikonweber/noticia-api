"use client";

import { useSidebarOffers } from "@/lib/api/hooks";
import type { Banner } from "@/lib/api/types";
import { formatPriceRange } from "@/lib/format";
import { BannerAnchor, BannerImage, SponsoredLabel } from "./shared";

type Props = {
  limit?: number;
  title?: string;
};

export function SidebarBanner({ limit = 4, title = "Notebooks e tech" }: Props) {
  const { data, isSuccess, isLoading } = useSidebarOffers(limit);

  if (isLoading) {
    return (
      <div className="space-y-3" aria-hidden>
        {Array.from({ length: Math.min(limit, 3) }).map((_, i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-xl border border-dashed border-[var(--border)] bg-[var(--elevated)]/40"
          />
        ))}
      </div>
    );
  }

  if (!isSuccess || !data.items.length) return null;

  return (
    <div className="sticky top-20 space-y-3">
      <p className="px-0.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
        {title}
      </p>
      {data.items.map((banner) => (
        <SidebarBannerCard key={banner.id} banner={banner} />
      ))}
    </div>
  );
}

export function SidebarBannerStatic({
  banners,
  title = "Notebooks e tech",
}: {
  banners: Banner[];
  title?: string;
}) {
  if (!banners.length) return null;

  return (
    <div className="sticky top-20 space-y-3">
      <p className="px-0.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
        {title}
      </p>
      {banners.map((banner) => (
        <SidebarBannerCard key={banner.id} banner={banner} />
      ))}
    </div>
  );
}

function SidebarBannerCard({ banner }: { banner: Banner }) {
  const price = formatPriceRange(banner);

  return (
    <aside className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-3">
      <div className="mb-2">
        <SponsoredLabel />
      </div>
      <BannerAnchor banner={banner} className="group block space-y-2">
        <div className="overflow-hidden rounded-lg border border-[var(--border)]">
          <BannerImage banner={banner} className="aspect-[4/3] w-full" />
        </div>
        <p className="line-clamp-2 text-xs font-medium leading-snug group-hover:text-[var(--accent)]">
          {banner.title}
        </p>
        {banner.shop && (
          <p className="text-[11px] text-[var(--muted)]">{banner.shop.name}</p>
        )}
        {price && (
          <p className="text-xs font-semibold text-[var(--foreground)]">
            {price}
          </p>
        )}
        {banner.discountPercent != null && banner.discountPercent > 0 && (
          <p className="text-[10px] font-medium text-[var(--accent)]">
            -{banner.discountPercent}%
          </p>
        )}
        <span className="block text-[11px] font-medium text-[var(--accent)] opacity-80 group-hover:opacity-100">
          Ver oferta ↗
        </span>
      </BannerAnchor>
    </aside>
  );
}

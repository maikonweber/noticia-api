"use client";

import { useBanners } from "@/lib/api/hooks";
import type { Banner } from "@/lib/api/types";
import { formatPriceRange } from "@/lib/format";
import { BannerAnchor, BannerImage, SponsoredLabel } from "./shared";

export function SidebarBanner() {
  const { data, isSuccess } = useBanners({
    type: "shop",
    placement: "sidebar",
    limit: 1,
  });

  if (!isSuccess || !data.items.length) return null;

  return <SidebarBannerCard banner={data.items[0]} />;
}

export function SidebarBannerStatic({ banner }: { banner: Banner }) {
  return <SidebarBannerCard banner={banner} />;
}

function SidebarBannerCard({ banner }: { banner: Banner }) {
  const price = formatPriceRange(banner);

  return (
    <aside className="sticky top-20 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-3">
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
          <p className="text-xs font-semibold text-[var(--foreground)]">{price}</p>
        )}
        {banner.commissionPercent != null && banner.commissionPercent > 0 && (
          <p className="text-[10px] text-[var(--muted)]">
            Comissão até {banner.commissionPercent}%
          </p>
        )}
      </BannerAnchor>
    </aside>
  );
}

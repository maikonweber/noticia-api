"use client";

import { useFreshOffers } from "@/lib/api/hooks";
import { BANNER_ROTATE_MS, useRotatingBanners } from "@/lib/banners/rotate";
import type { Banner } from "@/lib/api/types";
import { formatPriceRange } from "@/lib/format";
import { BannerAnchor, BannerImage, SponsoredLabel } from "./shared";

type Props = {
  limit?: number;
  title?: string;
  /** Slot distinto = query key distinta (itens diferentes) */
  slot?: number;
};

export function SidebarBanner({
  limit = 4,
  title = "Ofertas Shopee",
  slot = 0,
}: Props) {
  const poolSize = Math.max(limit * 3, 12);
  const { data, dataUpdatedAt, isLoading } = useFreshOffers(poolSize, slot);
  const pool = data?.items ?? [];
  const { items } = useRotatingBanners(
    pool,
    limit,
    BANNER_ROTATE_MS,
    slot,
    dataUpdatedAt,
  );

  if (isLoading && !items.length) {
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

  if (!items.length) return null;

  return (
    <div className="sticky top-20 space-y-3">
      <p className="px-0.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
        {title}
      </p>
      {items.map((banner) => (
        <SidebarBannerCard
          key={`${banner.id}-${banner.externalId}`}
          banner={banner}
        />
      ))}
    </div>
  );
}

export function SidebarBannerStatic({
  banners,
  title = "Ofertas Shopee",
  limit,
}: {
  banners: Banner[];
  title?: string;
  limit?: number;
}) {
  const count = limit ?? Math.min(4, banners.length || 4);
  const live = useFreshOffers(Math.max(count * 3, 12), 7);
  const pool = live.data?.items?.length ? live.data.items : banners;
  const { items } = useRotatingBanners(
    pool,
    count,
    BANNER_ROTATE_MS,
    0,
    live.dataUpdatedAt,
  );

  if (!items.length) return null;

  return (
    <div className="sticky top-20 space-y-3">
      <p className="px-0.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
        {title}
      </p>
      {items.map((banner) => (
        <SidebarBannerCard
          key={`${banner.id}-${banner.externalId}`}
          banner={banner}
        />
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

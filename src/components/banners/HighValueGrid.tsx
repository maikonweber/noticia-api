"use client";

import { useHighValueProducts } from "@/lib/api/hooks";
import { BANNER_ROTATE_MS, useRotatingBanners } from "@/lib/banners/rotate";
import type { Banner } from "@/lib/api/types";
import { formatPrice } from "@/lib/format";
import { BannerAnchor, BannerImage, SponsoredLabel } from "./shared";

type Props = {
  minPrice?: number;
  limit?: number;
};

const GRID_POOL_MULTIPLIER = 2;

export function HighValueGrid({ minPrice, limit = 12 }: Props) {
  const poolLimit = Math.max(limit * GRID_POOL_MULTIPLIER, 16);
  const { data, isSuccess, isLoading, isError } = useHighValueProducts({
    minPrice,
    limit: poolLimit,
  });
  const pool = data?.items ?? [];
  const { items } = useRotatingBanners(pool, limit, BANNER_ROTATE_MS);

  if (isLoading) {
    return (
      <section
        aria-label="Carregando aparelhos de alto valor"
        className="space-y-3"
      >
        <Header />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse rounded-xl border border-dashed border-[var(--border)] bg-[var(--elevated)]/40"
            />
          ))}
        </div>
      </section>
    );
  }

  if (isError || !isSuccess || !items.length) return null;

  return (
    <section aria-label="Aparelhos de alto valor" className="space-y-3">
      <Header />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((banner) => (
          <HighValueCard
            key={`${banner.id}-${banner.externalId}`}
            banner={banner}
          />
        ))}
      </div>
    </section>
  );
}

function Header() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          Aparelhos de alto valor
        </h2>
        <p className="mt-0.5 text-xs text-[var(--muted)]">
          Notebook, PC e tech — ofertas Shopee
        </p>
      </div>
      <SponsoredLabel />
    </div>
  );
}

function HighValueCard({ banner }: { banner: Banner }) {
  const price = formatPrice(banner.price ?? banner.priceMin ?? banner.priceMax);

  return (
    <BannerAnchor
      banner={banner}
      className="group flex flex-col overflow-hidden rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] transition-colors hover:border-[var(--accent)]/50"
    >
      <div className="relative aspect-square overflow-hidden border-b border-[var(--border)] bg-[var(--elevated)]/30">
        <BannerImage
          banner={banner}
          className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {banner.discountPercent != null && banner.discountPercent > 0 && (
          <span className="absolute left-2 top-2 rounded bg-[var(--accent)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--accent-fg)]">
            -{banner.discountPercent}%
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-2.5">
        <p className="line-clamp-2 text-xs font-medium leading-snug group-hover:text-[var(--accent)]">
          {banner.title}
        </p>
        {banner.shop && (
          <p className="truncate text-[10px] text-[var(--muted)]">
            {banner.shop.name}
          </p>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-0.5 pt-1 text-xs">
          {price && (
            <span className="font-semibold text-[var(--foreground)]">
              {price}
            </span>
          )}
          {banner.rating != null && banner.rating > 0 && (
            <span className="text-[var(--muted)]">
              ★ {banner.rating.toFixed(1)}
            </span>
          )}
        </div>
        <span className="text-[11px] font-medium text-[var(--accent)] opacity-80 group-hover:opacity-100">
          Ver oferta ↗
        </span>
      </div>
    </BannerAnchor>
  );
}

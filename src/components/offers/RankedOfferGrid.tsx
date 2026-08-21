"use client";

import { BannerAnchor, BannerImage, SponsoredLabel } from "@/components/banners/shared";
import { useOfferRanking } from "@/lib/api/hooks";
import { formatPrice } from "@/lib/format";
import type { Banner } from "@/lib/api/types";

export function RankedOfferGrid({ limit = 24 }: { limit?: number }) {
  const { data, isLoading } = useOfferRanking(limit);
  const items = data?.items ?? [];

  if (isLoading && !items.length) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] animate-pulse rounded-xl border border-dashed border-[var(--border)] bg-[var(--elevated)]/40"
          />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <p className="text-sm text-[var(--muted)]">
        Nenhuma oferta ranqueada ainda. O catálogo Shopee sincroniza a cada
        algumas horas.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-2">
        <p className="text-xs text-[var(--muted)]">
          Ranking por vendas, desconto, avaliação e comissão afiliada.
        </p>
        <SponsoredLabel />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((banner, index) => (
          <RankedCard
            key={`${banner.id}-${banner.externalId}`}
            banner={banner}
            rank={banner.rank ?? index + 1}
          />
        ))}
      </div>
    </div>
  );
}

function RankedCard({ banner, rank }: { banner: Banner; rank: number }) {
  const price = formatPrice(banner.price ?? banner.priceMin ?? banner.priceMax);

  return (
    <BannerAnchor
      banner={banner}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] transition-colors hover:border-[var(--accent)]/50"
    >
      <span className="absolute left-2 top-2 z-10 rounded bg-[var(--foreground)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--background)]">
        #{rank}
      </span>
      <div className="relative aspect-square overflow-hidden border-b border-[var(--border)] bg-[var(--elevated)]/30">
        <BannerImage
          banner={banner}
          className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {banner.discountPercent != null && banner.discountPercent > 0 && (
          <span className="absolute right-2 top-2 rounded bg-[var(--accent)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--accent-fg)]">
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
          {banner.sales != null && banner.sales > 0 && (
            <span className="text-[var(--muted)]">{banner.sales} vendas</span>
          )}
        </div>
      </div>
    </BannerAnchor>
  );
}

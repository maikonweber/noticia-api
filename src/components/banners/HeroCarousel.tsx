"use client";

import { useHeroBanners } from "@/lib/api/hooks";
import { BANNER_ROTATE_MS, useRotatingBanners } from "@/lib/banners/rotate";
import { formatPriceRange } from "@/lib/format";
import { BannerAnchor, BannerImage, SponsoredLabel } from "./shared";

const HERO_POOL = 16;

export function HeroCarousel() {
  const { data, dataUpdatedAt, isLoading, isError, isFetching } =
    useHeroBanners(HERO_POOL);
  const pool = data?.items ?? [];
  const { items, offset, total } = useRotatingBanners(
    pool,
    1,
    BANNER_ROTATE_MS,
    0,
    dataUpdatedAt,
  );
  const banner = items[0];

  if (isLoading && !banner) {
    return (
      <aside
        aria-hidden
        className="h-32 animate-pulse rounded-xl border border-dashed border-[var(--border)] bg-[var(--elevated)]/50"
      />
    );
  }

  if (isError && !banner) return null;
  if (!banner) return null;

  const price = formatPriceRange(banner);
  const dotCount = Math.min(5, Math.max(total, 1));
  const activeDot = total > 0 ? offset % dotCount : 0;

  return (
    <aside
      aria-label="Ofertas em destaque"
      className="overflow-hidden rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)]"
      data-fetching={isFetching ? "true" : undefined}
    >
      <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] px-3 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <SponsoredLabel />
          <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">
            Ofertas · Shopee
          </span>
        </div>
        {dotCount > 1 && (
          <div className="flex items-center gap-1.5" aria-hidden>
            {Array.from({ length: dotCount }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeDot
                    ? "w-4 bg-[var(--accent)]"
                    : "w-1.5 bg-[var(--border)]"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <BannerAnchor
        banner={banner}
        className="group flex items-stretch gap-0 sm:gap-4"
      >
        <div className="relative h-28 w-28 shrink-0 overflow-hidden sm:h-36 sm:w-48">
          <BannerImage
            banner={banner}
            className="h-full w-full transition-transform duration-300 group-hover:scale-[1.02]"
          />
          {banner.discountPercent != null && banner.discountPercent > 0 && (
            <span className="absolute left-1.5 top-1.5 rounded bg-[var(--accent)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--accent-fg)]">
              -{banner.discountPercent}%
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center py-3 pr-3 sm:py-4">
          <p className="line-clamp-2 text-sm font-medium leading-snug text-[var(--foreground)] group-hover:text-[var(--accent)] sm:text-base">
            {banner.title}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[var(--muted)]">
            {price && (
              <span className="font-semibold text-[var(--foreground)]">
                {price}
              </span>
            )}
            {banner.shop && <span>{banner.shop.name}</span>}
            {banner.rating != null && banner.rating > 0 && (
              <span>★ {banner.rating.toFixed(1)}</span>
            )}
          </div>
          <span className="mt-2 text-xs font-medium text-[var(--accent)] opacity-80 group-hover:opacity-100">
            Ver oferta ↗
          </span>
        </div>
      </BannerAnchor>
    </aside>
  );
}

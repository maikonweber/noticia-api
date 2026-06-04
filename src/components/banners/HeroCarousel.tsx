"use client";

import { useCallback, useEffect, useState } from "react";
import { useFeaturedBanners } from "@/lib/api/hooks";
import { formatPriceRange } from "@/lib/format";
import { BannerAnchor, BannerImage, SponsoredLabel } from "./shared";

const AUTOPLAY_MS = 8000;

export function HeroCarousel() {
  const { data, isSuccess } = useFeaturedBanners({ limit: 5, placement: "hero" });
  const items = data?.items ?? [];
  const [index, setIndex] = useState(0);

  const goTo = useCallback(
    (next: number) => {
      if (items.length === 0) return;
      setIndex((next + items.length) % items.length);
    },
    [items.length],
  );

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = window.setInterval(() => goTo(index + 1), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [goTo, index, items.length]);

  if (!isSuccess || items.length === 0) return null;

  const banner = items[index];
  const price = formatPriceRange(banner);

  return (
    <aside
      aria-label="Ofertas em destaque"
      className="overflow-hidden rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)]"
    >
      <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] px-3 py-2">
        <SponsoredLabel />
        {items.length > 1 && (
          <div className="flex items-center gap-1.5">
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Oferta ${i + 1} de ${items.length}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? "w-4 bg-[var(--accent)]"
                    : "w-1.5 bg-[var(--border)] hover:bg-[var(--muted)]"
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
        <div className="relative h-24 w-24 shrink-0 overflow-hidden sm:h-28 sm:w-36">
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
          <p className="line-clamp-2 text-sm font-medium leading-snug text-[var(--foreground)] group-hover:text-[var(--accent)]">
            {banner.title}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[var(--muted)]">
            {price && <span className="font-semibold text-[var(--foreground)]">{price}</span>}
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

"use client";

import { useBanners } from "@/lib/api/hooks";
import type { Banner } from "@/lib/api/types";
import { formatPriceRange } from "@/lib/format";
import { BannerAnchor, BannerImage, SponsoredLabel } from "./shared";

type Props = {
  page?: number;
  variant?: "compact" | "card";
};

export function InlineBanner({ page = 1, variant = "compact" }: Props) {
  const { data, isSuccess } = useBanners({
    featured: true,
    limit: 1,
    page,
  });

  if (!isSuccess || !data.items.length) return null;

  const banner = data.items[0];

  if (variant === "card") {
    return <InlineBannerCard banner={banner} />;
  }

  return <InlineBannerCompact banner={banner} />;
}

function InlineBannerCompact({ banner }: { banner: Banner }) {
  const price = formatPriceRange(banner);

  return (
    <aside className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--elevated)]/40 px-3 py-2.5">
      <div className="mb-2">
        <SponsoredLabel />
      </div>
      <BannerAnchor banner={banner} className="group flex items-center gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]">
          <BannerImage banner={banner} className="h-full w-full" />
          {banner.discountPercent != null && banner.discountPercent > 0 && (
            <span className="absolute bottom-0 left-0 right-0 bg-black/60 py-0.5 text-center text-[9px] font-medium text-white">
              -{banner.discountPercent}%
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-1 text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--accent)]">
            {banner.title}
          </p>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            {price && <span className="mr-2 font-semibold text-[var(--foreground)]">{price}</span>}
            Ver oferta na Shopee ↗
          </p>
        </div>
      </BannerAnchor>
    </aside>
  );
}

function InlineBannerCard({ banner }: { banner: Banner }) {
  const price = formatPriceRange(banner);

  return (
    <aside className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="mb-3">
        <SponsoredLabel />
      </div>
      <BannerAnchor banner={banner} className="group flex gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-[var(--border)]">
          <BannerImage banner={banner} className="h-full w-full" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-medium leading-snug group-hover:text-[var(--accent)]">
            {banner.title}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            {banner.discountPercent != null && banner.discountPercent > 0 && (
              <span className="rounded bg-[var(--accent)]/15 px-1.5 py-0.5 font-semibold text-[var(--accent)]">
                -{banner.discountPercent}%
              </span>
            )}
            {price && (
              <span className="font-semibold text-[var(--foreground)]">{price}</span>
            )}
          </div>
        </div>
      </BannerAnchor>
    </aside>
  );
}

export function InlineBannerStatic({ banner }: { banner: Banner }) {
  return <InlineBannerCard banner={banner} />;
}

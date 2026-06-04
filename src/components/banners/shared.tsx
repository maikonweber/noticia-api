import type { ReactNode } from "react";
import type { Banner } from "@/lib/api/types";

export const PLACEHOLDER_IMAGE = "/placeholder-produto.svg";

export function SponsoredLabel({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--muted)] ring-1 ring-[var(--border)] ${className}`}
    >
      Patrocinado · Shopee
    </span>
  );
}

export function BannerImage({
  banner,
  className = "",
}: {
  banner: Banner;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={banner.imageUrl ?? PLACEHOLDER_IMAGE}
      alt=""
      loading="lazy"
      className={`object-cover ${className}`}
    />
  );
}

export function BannerAnchor({
  banner,
  className = "",
  children,
}: {
  banner: Banner;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={banner.link}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={className}
    >
      {children}
    </a>
  );
}

import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/seo";

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(145deg, #1a1814 0%, #2a2622 55%, #c45c26 160%)",
          color: "#f0ebe3",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#c45c26",
              color: "#fffaf5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            N
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 36, fontWeight: 700 }}>{SITE_NAME}</span>
            <span style={{ fontSize: 18, color: "#a39e96" }}>Muttercorp</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.1 }}>
            {SITE_TAGLINE}
          </span>
          <span style={{ fontSize: 24, color: "#a39e96", maxWidth: 800 }}>
            Investimentos, crypto, tecnologia, programação, esportes, entretenimento, games e cinema
          </span>
        </div>
      </div>
    ),
    size,
  );
}

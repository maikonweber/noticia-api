import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/seo";

export const alt = `${SITE_NAME} — MutterCorp`;
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
          background:
            "linear-gradient(145deg, #0c1210 0%, #121a17 45%, #1a2420 70%, #c45c26 160%)",
          color: "#e8efe9",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "linear-gradient(135deg, #2a7a6a 0%, #c45c26 100%)",
              color: "#fff8f3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            M
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 36, fontWeight: 800 }}>MutterCorp</span>
            <span style={{ fontSize: 18, color: "#8a9a90" }}>{SITE_NAME}</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.1 }}>
            {SITE_TAGLINE}
          </span>
          <span style={{ fontSize: 24, color: "#8a9a90", maxWidth: 800 }}>
            Investimentos, crypto, tecnologia, programação, esportes,
            entretenimento, games e cinema
          </span>
        </div>
      </div>
    ),
    size,
  );
}

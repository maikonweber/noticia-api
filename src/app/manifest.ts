import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Notice — MutterCorp Notícias",
    short_name: "Notice",
    description:
      "Notícias por categoria (tecnologia, IA, segurança, economia, Brasil, mundo…) e painel de vulnerabilidades (CVEs).",
    lang: "pt-BR",
    start_url: "/categoria/tecnologia?utm_source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0c1210",
    theme_color: "#0c1210",
    categories: ["news", "technology"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Vulnerabilidades (CVEs)", short_name: "CVEs", url: "/vulnerabilidades", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
      { name: "Segurança", url: "/categoria/seguranca", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
      { name: "Inteligência Artificial", short_name: "IA", url: "/categoria/ia", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
    ],
  };
}

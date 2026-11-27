import type { Metadata, Viewport } from "next";
import { Manrope, Syne } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileNav } from "@/components/layout/MobileNav";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Analytics } from "@vercel/analytics/next";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildRootMetadata, buildWebsiteJsonLd } from "@/lib/seo";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  ...buildRootMetadata(),
  other: {
    "google-adsense-account": "ca-pub-1638014307034538",
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    title: "Notice",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef3ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1210" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${manrope.variable} ${syne.variable} h-full antialiased`}
    >
      <head>
        {/* Script nativo no <head> evita data-nscript do next/script, que o AdSense às vezes rejeita. */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1638014307034538"
          crossOrigin="anonymous"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <JsonLd data={buildWebsiteJsonLd()} />
        <QueryProvider>
          <Header />
          <main className="relative mx-auto w-full max-w-6xl flex-1 px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-5 sm:px-6 sm:pt-8 md:pb-8">
            {children}
          </main>
          <SiteFooter />
          <MobileNav />
          <ServiceWorkerRegister />
          {/* Vercel Analytics só existe quando hospedado na Vercel; na VPS o script dava 404 */}
          {process.env.VERCEL ? <Analytics /> : null}
        </QueryProvider>
      </body>
    </html>
  );
}

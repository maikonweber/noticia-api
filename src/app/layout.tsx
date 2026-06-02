import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { QueryProvider } from "@/components/providers/QueryProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Notice — Muttercorp",
    template: "%s · Notice",
  },
  description:
    "Agregador de notícias por categoria: investimentos, tecnologia, programação, esportes e entretenimento.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <QueryProvider>
          <Header />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
            {children}
          </main>
          <footer className="border-t border-[var(--border)] py-6 text-center text-xs text-[var(--muted)]">
            Notice API ·{" "}
            <a
              href="https://notice.muttercorp.com.br/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--foreground)]"
            >
              Swagger
            </a>
          </footer>
        </QueryProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { OfferGroupList } from "@/components/offers/OfferGroupList";
import { RankedOfferGrid } from "@/components/offers/RankedOfferGrid";

export const metadata: Metadata = {
  title: "Grupos de Ofertas",
  description:
    "As melhores ofertas Shopee ranqueadas pelo Notice. Entre nos grupos de WhatsApp e receba o ranking automaticamente.",
};

export default function OfertasPage() {
  return (
    <div className="space-y-10">
      <header className="max-w-2xl space-y-3">
        <p className="eyebrow">Shopee · WhatsApp</p>
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
          Grupos de Ofertas
        </h1>
        <p className="text-sm leading-relaxed text-[var(--muted)] sm:text-base">
          O Notice ranqueia o catálogo afiliado da Shopee por vendas, desconto,
          avaliação e comissão. As melhores entram nos grupos de WhatsApp —
          com foto, preço e link de afiliado.
        </p>
      </header>

      <section className="space-y-3" aria-labelledby="grupos-heading">
        <h2 id="grupos-heading" className="text-lg font-semibold tracking-tight">
          Entre nos grupos
        </h2>
        <OfferGroupList />
      </section>

      <section className="space-y-3" aria-labelledby="ranking-heading">
        <h2 id="ranking-heading" className="text-lg font-semibold tracking-tight">
          Ranking agora
        </h2>
        <RankedOfferGrid />
      </section>
    </div>
  );
}

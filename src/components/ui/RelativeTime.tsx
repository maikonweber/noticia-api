"use client";

import { useSyncExternalStore } from "react";
import { formatArticleDate, formatRelativeDate } from "@/lib/format";

// "Relógio" compartilhado que avança a cada minuto
function subscribe(onChange: () => void) {
  const t = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(t);
}
const getMinute = () => Math.floor(Date.now() / 60_000);
const getServerMinute = () => 0;

/**
 * SSR/hidratação renderizam a data absoluta (fuso fixo America/Sao_Paulo, determinística);
 * depois o cliente troca para "há 5 min". Evita o erro de hidratação React #418
 * causado por texto relativo diferente entre servidor e navegador.
 */
export function RelativeTime({ iso, className }: { iso: string; className?: string }) {
  const minute = useSyncExternalStore(subscribe, getMinute, getServerMinute);
  const absolute = formatArticleDate(iso, iso);
  return (
    <time dateTime={iso} className={className} title={absolute}>
      {minute ? formatRelativeDate(iso) : absolute}
    </time>
  );
}

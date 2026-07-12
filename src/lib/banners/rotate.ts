"use client";

import { useEffect, useMemo, useState } from "react";
import type { Banner } from "@/lib/api/types";

/** Intervalo de troca automática dos banners */
export const BANNER_ROTATE_MS = 30_000;

export function shuffleBanners(items: Banner[]): Banner[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j]!;
    arr[j] = tmp!;
  }
  return arr;
}

function poolKey(items: Banner[]): string {
  return items.map((item) => String(item.id)).join(",");
}

export type RotatingBannersResult = {
  items: Banner[];
  offset: number;
  total: number;
};

/**
 * Embaralha o pool a cada reload e avança a janela a cada `intervalMs`.
 * Ao fim do deck, reembaralha. `slot` desloca o início (vários inlines).
 */
export function useRotatingBanners(
  pool: Banner[],
  count: number,
  intervalMs = BANNER_ROTATE_MS,
  slot = 0,
): RotatingBannersResult {
  const key = poolKey(pool);
  const [epoch, setEpoch] = useState(0);
  const [offset, setOffset] = useState(0);

  const deck = useMemo(
    () => (pool.length ? shuffleBanners(pool) : []),
    // epoch força novo shuffle a cada ciclo completo
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, epoch],
  );

  useEffect(() => {
    if (!deck.length) {
      setOffset(0);
      return;
    }
    setOffset(slot % deck.length);
  }, [key, slot, deck.length]);

  useEffect(() => {
    if (deck.length <= 1) return;

    const step = Math.max(count, 1);
    const timer = window.setInterval(() => {
      setOffset((prev) => {
        const next = prev + step;
        if (next >= deck.length) {
          setEpoch((e) => e + 1);
          return slot % deck.length;
        }
        return next;
      });
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [deck.length, count, intervalMs, slot]);

  const items = useMemo(() => {
    if (!deck.length) return [];
    if (deck.length <= count) return deck;

    const visible: Banner[] = [];
    for (let i = 0; i < count; i++) {
      visible.push(deck[(offset + i) % deck.length]!);
    }
    return visible;
  }, [deck, offset, count]);

  return { items, offset, total: deck.length };
}

export function useRotatingBanner(
  pool: Banner[],
  intervalMs = BANNER_ROTATE_MS,
  slot = 0,
): Banner | null {
  const { items } = useRotatingBanners(pool, 1, intervalMs, slot);
  return items[0] ?? null;
}

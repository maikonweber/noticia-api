"use client";

import { useState } from "react";

export function CopyFeedUrl({ url, label = "Copiar link" }: { url: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copie o endereço do feed:", url);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--border)] px-3 text-xs font-medium hover:border-[var(--accent)]"
      aria-label={`${label}: ${url}`}
    >
      {copied ? "Copiado ✓" : label}
    </button>
  );
}

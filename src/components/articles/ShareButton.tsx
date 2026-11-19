"use client";

import { useState } from "react";

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* usuário cancelou */
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-medium hover:border-[var(--accent)]"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v14" />
      </svg>
      {copied ? "Link copiado" : "Compartilhar"}
    </button>
  );
}

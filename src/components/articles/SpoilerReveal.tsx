"use client";

import { useState, type ReactNode } from "react";

type Props = {
  enabled: boolean;
  children: ReactNode;
  /** Classes no container relativo */
  className?: string;
};

export function SpoilerReveal({ enabled, children, className = "" }: Props) {
  const [open, setOpen] = useState(false);

  if (!enabled) return <>{children}</>;

  return (
    <div className={`relative ${className}`}>
      <div
        className={open ? undefined : "select-none blur-[7px]"}
        aria-hidden={!open}
      >
        {children}
      </div>
      {!open ? (
        <button
          type="button"
          className="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-[var(--surface)]/55 px-3 text-center text-sm font-semibold text-[var(--foreground)]"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setOpen(true);
          }}
        >
          Toque para ver o spoiler
        </button>
      ) : null}
    </div>
  );
}

export function SpoilerBadge() {
  return (
    <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
      Spoiler
    </span>
  );
}

export function OnePieceBadge() {
  return (
    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-400">
      One Piece
    </span>
  );
}

export function ArticlePreviewSkeleton() {
  return (
    <div
      className="mb-3 space-y-2"
      aria-hidden
      role="presentation"
    >
      <div className="h-3 w-full animate-pulse rounded bg-[var(--elevated)]" />
      <div className="h-3 w-4/5 animate-pulse rounded bg-[var(--elevated)]" />
    </div>
  );
}

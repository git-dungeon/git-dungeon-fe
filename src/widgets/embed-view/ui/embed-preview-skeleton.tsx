export function EmbedPreviewSkeleton() {
  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-4">
      <div className="bg-muted/20 h-64 w-full animate-pulse rounded-2xl" />
      <div className="bg-muted/20 h-3 w-1/3 animate-pulse rounded" />
      <div className="bg-muted/20 h-3 w-1/4 animate-pulse rounded" />
    </div>
  );
}

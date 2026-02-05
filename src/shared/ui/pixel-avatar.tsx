import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface PixelAvatarProps {
  src?: string | null;
  alt: string;
  fallback?: ReactNode;
  className?: string;
  imageClassName?: string;
  loading?: "eager" | "lazy";
}

export function PixelAvatar({
  src,
  alt,
  fallback,
  className,
  imageClassName,
  loading = "lazy",
}: PixelAvatarProps) {
  const resolvedSrc = src?.trim() ? src : null;
  const resolvedImageClassName = resolvedSrc
    ? cn("object-contain", imageClassName ?? "h-full w-full")
    : cn("flex items-center justify-center", imageClassName ?? "h-full w-full");

  return (
    <div
      className={cn("pixel-avatar", className)}
      {...(!resolvedSrc ? { role: "img", "aria-label": alt } : undefined)}
    >
      {resolvedSrc ? (
        <img
          src={resolvedSrc}
          alt={alt}
          className={resolvedImageClassName}
          loading={loading}
        />
      ) : (
        <div className={resolvedImageClassName} aria-hidden>
          {fallback ?? <span className="pixel-text-muted text-xs">—</span>}
        </div>
      )}
    </div>
  );
}

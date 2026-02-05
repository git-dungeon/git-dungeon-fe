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

  return (
    <div
      className={cn("pixel-avatar", className)}
      {...(!resolvedSrc ? { role: "img", "aria-label": alt } : undefined)}
    >
      {resolvedSrc ? (
        <img
          src={resolvedSrc}
          alt={alt}
          className={cn("h-full w-full object-contain", imageClassName)}
          loading={loading}
        />
      ) : (
        <div
          className={cn(
            "pixel-text-base flex h-full w-full items-center justify-center",
            imageClassName
          )}
          aria-hidden
        >
          {fallback ?? <span className="pixel-text-muted text-xs">—</span>}
        </div>
      )}
    </div>
  );
}

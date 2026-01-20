import type { HTMLAttributes } from "react";
import { cn } from "@/shared/lib/utils";

interface PixelSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  titleWidth?: string;
  lineWidths?: string[];
}

export function PixelSkeleton({
  titleWidth = "w-28",
  lineWidths = ["w-40", "w-52", "w-32"],
  className,
  ...props
}: PixelSkeletonProps) {
  return (
    <div className={cn("pixel-skeleton", className)} {...props}>
      <div className={cn("pixel-skeleton-line", titleWidth)} />
      <div className="pixel-skeleton-block">
        {lineWidths.map((widthClass, index) => (
          <div
            key={`${widthClass}-${index}`}
            className={cn("pixel-skeleton-line", widthClass)}
          />
        ))}
      </div>
    </div>
  );
}

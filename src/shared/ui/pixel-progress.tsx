import type { ReactNode } from "react";
import { clampPercent } from "@/shared/lib/math";
import { cn } from "@/shared/lib/utils";

type PixelProgressTone = "hp" | "exp" | "progress";
type PixelProgressSize = "default" | "value";

interface PixelProgressProps {
  percent: number;
  tone?: PixelProgressTone;
  size?: PixelProgressSize;
  className?: string;
  valueLabel?: ReactNode;
  ariaLabel?: string;
}

export function PixelProgress({
  percent,
  tone = "hp",
  size = "default",
  className,
  valueLabel,
  ariaLabel,
}: PixelProgressProps) {
  const resolvedPercent = clampPercent(percent);

  return (
    <div
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={resolvedPercent}
      className={cn(
        "pixel-bar",
        size === "value" && "pixel-bar--value",
        className
      )}
    >
      <div
        className={cn("pixel-bar-fill", `pixel-bar-fill--${tone}`)}
        style={{ width: `${resolvedPercent}%` }}
      />
      {valueLabel ? (
        <span className="pixel-bar-value">{valueLabel}</span>
      ) : null}
    </div>
  );
}

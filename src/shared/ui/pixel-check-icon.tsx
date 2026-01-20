import type { HTMLAttributes } from "react";
import { cn } from "@/shared/lib/utils";
import { PixelIcon } from "@/shared/ui/pixel-icon";

type PixelCheckIconTone = "success" | "danger";

interface PixelCheckIconProps extends HTMLAttributes<HTMLSpanElement> {
  checked?: boolean;
  size?: number;
  iconSize?: number;
  tone?: PixelCheckIconTone;
}

export function PixelCheckIcon({
  checked = true,
  size,
  iconSize,
  tone,
  className,
  style,
  ...props
}: PixelCheckIconProps) {
  if (!checked) {
    return null;
  }

  const resolvedIconSize = iconSize ?? (size ? Math.round(size * 0.66) : 12);
  const mergedStyle = size ? { width: size, height: size, ...style } : style;

  const toneClass =
    tone === "success"
      ? "pixel-log-thumb-badge--success"
      : tone === "danger"
        ? "pixel-log-thumb-badge--danger"
        : undefined;

  return (
    <span
      aria-hidden="true"
      className={cn(
        "pixel-checkbox",
        "pixel-checkbox--checked",
        toneClass,
        className
      )}
      style={mergedStyle}
      {...props}
    >
      <PixelIcon
        name="check"
        size={resolvedIconSize}
        className="pixel-checkbox-icon"
        style={{ width: resolvedIconSize, height: resolvedIconSize }}
      />
    </span>
  );
}

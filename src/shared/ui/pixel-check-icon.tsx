import type { HTMLAttributes } from "react";
import { cn } from "@/shared/lib/utils";
import { PixelIcon } from "@/shared/ui/pixel-icon";

interface PixelCheckIconProps extends HTMLAttributes<HTMLSpanElement> {
  checked?: boolean;
}

export function PixelCheckIcon({
  checked = true,
  className,
  ...props
}: PixelCheckIconProps) {
  if (!checked) {
    return null;
  }

  return (
    <span
      aria-hidden="true"
      className={cn("pixel-checkbox", "pixel-checkbox--checked", className)}
      {...props}
    >
      <PixelIcon name="check" className="pixel-checkbox__icon" />
    </span>
  );
}

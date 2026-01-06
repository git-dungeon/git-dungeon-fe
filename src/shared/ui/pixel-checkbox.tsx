import type { HTMLAttributes } from "react";
import { cn } from "@/shared/lib/utils";
import { PixelIcon } from "@/shared/ui/pixel-icon";

interface PixelCheckboxProps extends HTMLAttributes<HTMLSpanElement> {
  checked?: boolean;
}

export function PixelCheckbox({
  checked = false,
  className,
  ...props
}: PixelCheckboxProps) {
  return (
    <span
      className={cn(
        "pixel-checkbox",
        checked && "pixel-checkbox--checked",
        className
      )}
      {...props}
    >
      {checked ? (
        <PixelIcon name="check" className="pixel-checkbox__icon" />
      ) : null}
    </span>
  );
}

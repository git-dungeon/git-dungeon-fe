import type { ComponentProps } from "react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

interface PixelSlotButtonProps extends ComponentProps<typeof Button> {
  selected?: boolean;
}

export function PixelSlotButton({
  selected = false,
  className,
  variant,
  ...props
}: PixelSlotButtonProps) {
  return (
    <Button
      variant={variant ?? "ghost"}
      className={cn(
        "pixel-slot hover:bg-transparent",
        selected && "pixel-slot--selected",
        className
      )}
      {...props}
    />
  );
}

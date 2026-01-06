import type { ComponentProps } from "react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

type PixelButtonTone = "default" | "danger";
type PixelButtonSize = "default" | "compact";

interface PixelButtonProps extends ComponentProps<typeof Button> {
  tone?: PixelButtonTone;
  pixelSize?: PixelButtonSize;
}

export function PixelButton({
  tone = "default",
  pixelSize = "default",
  className,
  variant,
  ...props
}: PixelButtonProps) {
  return (
    <Button
      variant={variant ?? "ghost"}
      className={cn(
        "pixel-button",
        tone === "danger" && "pixel-button--danger",
        pixelSize === "compact" && "pixel-button--compact",
        className
      )}
      {...props}
    />
  );
}

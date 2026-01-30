import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";

type PixelInputProps = ComponentProps<"input">;

export function PixelInput({ className, ...props }: PixelInputProps) {
  return (
    <input
      data-slot="input"
      className={cn("pixel-input", className)}
      {...props}
    />
  );
}

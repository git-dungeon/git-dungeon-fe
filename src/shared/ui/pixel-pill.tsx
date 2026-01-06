import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import type { EquipmentRarity } from "@/entities/inventory/model/types";
import { PixelIcon } from "@/shared/ui/pixel-icon";

type PixelPillTone = "neutral" | "gain" | "loss" | "rarity";
type PixelPillIcon = "up" | "down";

interface PixelPillProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: PixelPillTone;
  rarity?: EquipmentRarity;
  icon?: PixelPillIcon;
  children: ReactNode;
}

export function PixelPill({
  tone = "neutral",
  rarity,
  icon,
  className,
  children,
  ...props
}: PixelPillProps) {
  return (
    <span
      className={cn(
        "pixel-pill",
        tone === "gain"
          ? "pixel-pill--gain"
          : tone === "loss"
            ? "pixel-pill--loss"
            : tone === "rarity"
              ? "pixel-pill--rarity"
              : "pixel-pill--neutral",
        tone === "rarity" && rarity ? `rarity-${rarity}` : null,
        className
      )}
      {...props}
    >
      {icon ? (
        <PixelIcon
          name={icon === "up" ? "arrow-up" : "arrow-down"}
          size={10}
          className="pixel-pill__icon"
        />
      ) : null}
      {children}
    </span>
  );
}

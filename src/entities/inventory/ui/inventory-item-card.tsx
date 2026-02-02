import type { InventoryItem } from "@/entities/inventory/model/types";
import { getInventorySlotLabel } from "@/entities/inventory/config/slot-labels";
import { formatRarity } from "@/entities/dashboard/lib/formatters";
import { formatInventoryEffect } from "@/entities/inventory/lib/formatters";
import { resolveLocalItemSprite } from "@/entities/catalog/config/local-sprites";
import {
  formatEnhancementStars,
  resolveEnhancementBonus,
  resolveEnhancementLevel,
} from "@/entities/inventory/lib/enhancement";
import { cn } from "@/shared/lib/utils";
import { formatStatChange, resolveStatLabel } from "@/shared/lib/stats/format";
import { PixelPill } from "@/shared/ui/pixel-pill";
import { useTranslation } from "react-i18next";

interface InventoryItemCardProps {
  item: InventoryItem;
  className?: string;
  showSlotLabel?: boolean;
  showModifiers?: boolean;
  showEffect?: boolean;
  showRarity?: boolean;
  truncateName?: boolean;
  displayName?: string;
  compact?: boolean;
  nameClassName?: string;
}

export function InventoryItemCard({
  item,
  className,
  showSlotLabel = true,
  showModifiers = true,
  showEffect = true,
  showRarity = true,
  truncateName = true,
  displayName,
  compact = false,
  nameClassName,
}: InventoryItemCardProps) {
  const { t } = useTranslation();
  const resolvedName = displayName ?? item.name ?? item.code;
  const sprite = resolveLocalItemSprite(item.code);
  const rarityClass = `rarity-${item.rarity ?? "common"}`;
  const statModifiers = item.modifiers.filter(
    (modifier) => modifier.kind === "stat"
  );
  const quantity = item.quantity ?? 1;
  const showQuantity = item.slot === "material" || quantity > 1;
  const enhancementLevel = resolveEnhancementLevel(item.enhancementLevel);
  const enhancementStars = formatEnhancementStars(enhancementLevel);
  const enhancementBonus = resolveEnhancementBonus(item.slot, enhancementLevel);

  if (compact) {
    return (
      <div
        className={cn("relative flex items-center justify-center", className)}
      >
        <div
          className={cn(
            "inventory-item-icon flex size-14 items-center justify-center overflow-hidden",
            rarityClass
          )}
        >
          {sprite ? (
            <img
              src={sprite}
              alt={resolvedName}
              loading="lazy"
              className="size-12 object-contain"
            />
          ) : (
            <div className="pixel-text-muted pixel-text-xs font-semibold tracking-wide">
              {resolvedName.slice(0, 2).toUpperCase()}
            </div>
          )}
          {showQuantity ? (
            <span className="bg-background/80 pixel-text-xs absolute top-1 right-1 rounded px-1 font-semibold">
              x{quantity}
            </span>
          ) : null}
          {enhancementStars ? (
            <span className="bg-background/80 pixel-text-xs absolute top-1 left-1 rounded px-1 font-semibold">
              {enhancementStars}
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center gap-2 text-center",
        className
      )}
    >
      <div
        className={cn(
          "inventory-item-icon relative flex size-14 items-center justify-center overflow-hidden",
          rarityClass
        )}
      >
        {sprite ? (
          <img
            src={sprite}
            alt={resolvedName}
            loading="lazy"
            className="size-14 object-cover"
          />
        ) : (
          <div className="pixel-text-muted pixel-text-xs font-semibold tracking-wide">
            {resolvedName.slice(0, 2).toUpperCase()}
          </div>
        )}
        {showQuantity ? (
          <span className="bg-background/80 pixel-text-xs absolute top-1 right-1 rounded px-1 font-semibold">
            x{quantity}
          </span>
        ) : null}
        {enhancementStars ? (
          <span className="bg-background/80 pixel-text-xs absolute top-1 left-1 rounded px-1 font-semibold">
            {enhancementStars}
          </span>
        ) : null}
      </div>
      <div className="flex flex-col items-center gap-1">
        {showSlotLabel ? (
          <span className="pixel-text-muted pixel-text-xs font-semibold tracking-wide">
            {getInventorySlotLabel(item.slot)}
          </span>
        ) : null}
        <span
          className={cn(
            "pixel-text-muted pixel-text-sm w-full text-center font-medium",
            truncateName
              ? "truncate"
              : "leading-tight break-words whitespace-normal",
            nameClassName
          )}
        >
          {resolvedName}
        </span>
      </div>
      <div className="flex flex-wrap justify-center gap-1">
        {showRarity ? (
          <PixelPill
            tone="rarity"
            rarity={item.rarity}
            className="text-[10px] font-semibold tracking-wide uppercase"
          >
            {formatRarity(item.rarity)}
          </PixelPill>
        ) : null}
        {enhancementStars ? (
          <PixelPill tone="neutral" className="text-[10px]">
            {t("inventory.enhancement.level", { level: enhancementLevel })}
          </PixelPill>
        ) : null}
        {showModifiers
          ? statModifiers.map((modifier, index) => {
              const label = resolveStatLabel(modifier.stat);
              const { text, tone } =
                modifier.mode === "percent"
                  ? {
                      text: `${label} ${modifier.value > 0 ? "+" : ""}${modifier.value}%`,
                      tone:
                        modifier.value > 0
                          ? ("success" as const)
                          : modifier.value < 0
                            ? ("danger" as const)
                            : ("neutral" as const),
                    }
                  : formatStatChange(modifier.stat, modifier.value);

              const iconTone =
                tone === "success" ? "up" : tone === "danger" ? "down" : null;

              return (
                <PixelPill
                  key={`${modifier.kind}-${modifier.stat}-${modifier.value}-${index}`}
                  tone={
                    tone === "success"
                      ? "success"
                      : tone === "danger"
                        ? "danger"
                        : "neutral"
                  }
                  icon={iconTone ?? undefined}
                  className="text-[10px]"
                >
                  {text}
                </PixelPill>
              );
            })
          : null}
        {showEffect && item.effect ? (
          <PixelPill tone="neutral" className="text-[10px]">
            {formatInventoryEffect(item.effect)}
          </PixelPill>
        ) : null}
      </div>
      {enhancementBonus ? (
        <p className="pixel-text-xs pixel-text-muted font-semibold">
          {t("inventory.enhancement.bonusLine", {
            stat: resolveStatLabel(enhancementBonus.stat),
            value: enhancementBonus.value,
          })}
        </p>
      ) : null}
    </div>
  );
}

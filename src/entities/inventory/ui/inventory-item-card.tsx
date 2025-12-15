import type { InventoryItem } from "@/entities/inventory/model/types";
import { getInventorySlotLabel } from "@/entities/inventory/config/slot-labels";
import { formatRarity } from "@/entities/dashboard/lib/formatters";
import { formatInventoryEffect } from "@/entities/inventory/lib/formatters";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";
import { formatStatChange, resolveStatLabel } from "@/shared/lib/stats/format";
import { BADGE_TONE_CLASSES } from "@/shared/ui/tone";

interface InventoryItemCardProps {
  item: InventoryItem;
  className?: string;
  showSlotLabel?: boolean;
}

export function InventoryItemCard({
  item,
  className,
  showSlotLabel = true,
}: InventoryItemCardProps) {
  const displayName = item.name ?? item.code;

  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center gap-2 text-center",
        className
      )}
    >
      <div className="border-border bg-muted/40 relative flex size-14 items-center justify-center overflow-hidden rounded-md border">
        {item.sprite ? (
          <img
            src={item.sprite}
            alt={displayName}
            loading="lazy"
            className="size-14 object-cover"
          />
        ) : (
          <div className="text-muted-foreground text-[11px] font-semibold tracking-wide">
            {displayName.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex flex-col items-center gap-1">
        {showSlotLabel ? (
          <span className="text-muted-foreground text-[11px] font-semibold tracking-wide">
            {getInventorySlotLabel(item.slot)}
          </span>
        ) : null}
        <span className="text-xs font-medium">{displayName}</span>
      </div>
      <div className="flex flex-wrap justify-center gap-1">
        <Badge
          variant="secondary"
          className="text-[10px] font-semibold tracking-wide uppercase"
        >
          {formatRarity(item.rarity)}
        </Badge>
        {item.modifiers
          .filter((modifier) => modifier.kind === "stat")
          .map((modifier, index) => {
            const label = resolveStatLabel(modifier.stat);
            const { text, tone } =
              modifier.mode === "percent"
                ? {
                    text: `${label} ${modifier.value > 0 ? "+" : ""}${modifier.value}%`,
                    tone:
                      modifier.value > 0
                        ? ("gain" as const)
                        : modifier.value < 0
                          ? ("loss" as const)
                          : ("neutral" as const),
                  }
                : formatStatChange(modifier.stat, modifier.value);

            return (
              <Badge
                key={`${modifier.kind}-${modifier.stat}-${modifier.value}-${index}`}
                variant="outline"
                className={cn("text-[10px]", BADGE_TONE_CLASSES[tone])}
              >
                {text}
              </Badge>
            );
          })}
        {item.effect ? (
          <Badge variant="outline" className="text-[10px]">
            {formatInventoryEffect(item.effect)}
          </Badge>
        ) : null}
      </div>
    </div>
  );
}

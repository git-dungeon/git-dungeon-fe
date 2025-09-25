import type { InventoryItem } from "@/entities/inventory/model/types";
import { getInventorySlotLabel } from "@/entities/inventory/config/slot-labels";
import {
  formatModifier,
  formatRarity,
} from "@/entities/dashboard/lib/formatters";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";

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
  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center gap-2 text-center",
        className
      )}
    >
      <div className="border-border bg-muted/40 relative flex size-14 items-center justify-center overflow-hidden rounded-md border">
        <img
          src={item.sprite}
          alt={item.name}
          loading="lazy"
          className="size-14 object-cover"
        />
      </div>
      <div className="flex flex-col items-center gap-1">
        {showSlotLabel ? (
          <span className="text-muted-foreground text-[11px] font-semibold tracking-wide">
            {getInventorySlotLabel(item.slot)}
          </span>
        ) : null}
        <span className="text-xs font-medium">{item.name}</span>
      </div>
      <div className="flex flex-wrap justify-center gap-1">
        <Badge
          variant="secondary"
          className="text-[10px] font-semibold tracking-wide uppercase"
        >
          {formatRarity(item.rarity)}
        </Badge>
        {item.modifiers.map((modifier) => (
          <Badge
            key={`${modifier.stat}-${modifier.value}`}
            variant="outline"
            className="text-[10px]"
          >
            {formatModifier(modifier)}
          </Badge>
        ))}
      </div>
    </div>
  );
}

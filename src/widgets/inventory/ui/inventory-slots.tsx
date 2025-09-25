import type {
  InventoryEquippedMap,
  InventoryItem,
} from "@/entities/inventory/model/types";
import type { EquipmentSlot } from "@/entities/dashboard/model/types";
import { InventoryItemCard } from "@/entities/inventory/ui/inventory-item-card";
import { getInventorySlotLabel } from "@/entities/inventory/config/slot-labels";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

interface InventorySlotsProps {
  equipped: InventoryEquippedMap;
  selectedItemId?: string | null;
  onSelect: (item: InventoryItem, slot: EquipmentSlot) => void;
}

export function InventorySlots({ equipped, onSelect }: InventorySlotsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">장착 슬롯</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {(
            Object.entries(equipped) as Array<
              [EquipmentSlot, InventoryItem | null]
            >
          ).map(([slot, item]) => (
            <Button
              key={slot}
              type="button"
              variant="outline"
              onClick={() => {
                if (item) {
                  onSelect(item, slot);
                }
              }}
              title={item ? item.name : undefined}
              className={cn(
                "group bg-background flex h-auto w-full flex-col items-center justify-center gap-2 p-3 text-center transition"
              )}
            >
              {item ? (
                <InventoryItemCard item={item} />
              ) : (
                <EmptySlot slot={slot} />
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptySlot({ slot }: { slot: EquipmentSlot }) {
  return (
    <div className="flex w-full flex-col items-center gap-2 text-center">
      <div className="border-border flex size-14 items-center justify-center rounded-md border border-dashed" />
      <div className="space-y-1">
        <p className="text-xs font-semibold tracking-wide">
          {getInventorySlotLabel(slot)}
        </p>
        <p className="text-muted-foreground text-[11px]">장비 없음</p>
      </div>
    </div>
  );
}

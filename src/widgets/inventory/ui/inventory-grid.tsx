import type { InventoryItem } from "@/entities/inventory/model/types";
import type { EquipmentSlot } from "@/entities/dashboard/model/types";
import { InventoryItemCard } from "@/entities/inventory/ui/inventory-item-card";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";

interface InventoryGridProps {
  items: InventoryItem[];
  selectedItemId?: string | null;
  onSelect: (item: InventoryItem) => void;
}

const SLOT_ORDER: Record<EquipmentSlot, number> = {
  helmet: 0,
  armor: 1,
  weapon: 2,
  ring: 3,
};

export function InventoryGrid({ items, onSelect }: InventoryGridProps) {
  const sortedItems = [...items].sort((a, b) => {
    if (a.isEquipped !== b.isEquipped) {
      return a.isEquipped ? -1 : 1;
    }

    if (SLOT_ORDER[a.slot] !== SLOT_ORDER[b.slot]) {
      return SLOT_ORDER[a.slot] - SLOT_ORDER[b.slot];
    }

    return new Date(b.obtainedAt).getTime() - new Date(a.obtainedAt).getTime();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>인벤토리</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {sortedItems.map((item) => (
            <InventoryGridCell key={item.id} item={item} onSelect={onSelect} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface InventoryGridCellProps {
  item: InventoryItem;
  onSelect: (item: InventoryItem) => void;
}

function InventoryGridCell({ item, onSelect }: InventoryGridCellProps) {
  return (
    <Button
      type="button"
      title={item.name}
      variant="outline"
      onClick={() => onSelect(item)}
      className={cn(
        "group bg-background relative flex h-auto w-full flex-col items-center justify-center p-3"
      )}
    >
      <InventoryItemCard item={item} />
      {item.isEquipped ? (
        <Badge className="absolute top-2 left-2">장착</Badge>
      ) : null}
    </Button>
  );
}

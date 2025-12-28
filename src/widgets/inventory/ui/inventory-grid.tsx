import type {
  InventoryItem,
  InventoryItemSlot,
} from "@/entities/inventory/model/types";
import { InventoryItemCard } from "@/entities/inventory/ui/inventory-item-card";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { useTranslation } from "react-i18next";

interface InventoryGridProps {
  items: InventoryItem[];
  selectedItemId?: string | null;
  onSelect: (item: InventoryItem) => void;
}

const SLOT_ORDER: Record<InventoryItemSlot, number> = {
  helmet: 0,
  armor: 1,
  weapon: 2,
  ring: 3,
  consumable: 4,
};

export function InventoryGrid({ items, onSelect }: InventoryGridProps) {
  const { t } = useTranslation();
  const sortedItems = [...items].sort((a, b) => {
    if (a.isEquipped !== b.isEquipped) {
      return a.isEquipped ? -1 : 1;
    }

    if (SLOT_ORDER[a.slot] !== SLOT_ORDER[b.slot]) {
      return SLOT_ORDER[a.slot] - SLOT_ORDER[b.slot];
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("inventory.grid.title")}</CardTitle>
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
  const { t } = useTranslation();
  return (
    <Button
      type="button"
      title={item.name ?? item.code}
      variant="outline"
      onClick={() => onSelect(item)}
      className={cn(
        "group bg-background relative flex h-auto w-full flex-col items-center justify-center p-3"
      )}
    >
      <InventoryItemCard item={item} />
      {item.isEquipped ? (
        <Badge className="absolute top-2 left-2">
          {t("inventory.grid.equipped")}
        </Badge>
      ) : null}
    </Button>
  );
}

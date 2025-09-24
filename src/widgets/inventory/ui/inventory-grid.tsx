import type { InventoryItem } from "@/entities/inventory/model/types";
import type { EquipmentSlot } from "@/entities/dashboard/model/types";
import {
  formatModifier,
  formatRarity,
} from "@/entities/dashboard/lib/formatters";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

interface InventoryGridProps {
  items: InventoryItem[];
  selectedItemId?: string | null;
  onSelect: (item: InventoryItem) => void;
}

const GRID_COLUMNS = 5;
const GRID_ROWS = 4;
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

  const slotCells: Array<InventoryItem | null> = sortedItems.slice(
    0,
    GRID_COLUMNS * GRID_ROWS
  );

  while (slotCells.length < GRID_COLUMNS * GRID_ROWS) {
    slotCells.push(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>인벤토리</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: `repeat(${GRID_COLUMNS}, minmax(0, 1fr))`,
          }}
        >
          {slotCells.map((item, index) => (
            <InventoryGridCell
              key={item ? item.id : `placeholder-${index}`}
              item={item}
              onSelect={onSelect}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface InventoryGridCellProps {
  item: InventoryItem | null;
  onSelect: (item: InventoryItem) => void;
}

function InventoryGridCell({ item, onSelect }: InventoryGridCellProps) {
  if (!item) {
    return (
      <Button
        type="button"
        variant="outline"
        className={cn(
          "relative flex h-auto flex-col items-center justify-center gap-2 border-dashed transition"
        )}
      >
        <span className="truncate text-[11px] font-medium">빈 슬롯</span>
      </Button>
    );
  }

  const tooltip = buildTooltip(item);

  return (
    <Button
      type="button"
      title={tooltip}
      variant="outline"
      onClick={() => onSelect(item)}
      className={cn(
        "relative flex h-auto flex-col items-center justify-center gap-2 transition",
        item.isEquipped ? "" : ""
      )}
    >
      <img
        src={item.sprite}
        alt={item.name}
        loading="lazy"
        className="pointer-events-none h-14 w-14 object-cover"
      />
      <span className="truncate text-[11px] font-medium">{item.name}</span>
      {item.isEquipped ? (
        <span className="bg-primary text-primary-foreground absolute top-1 left-1 rounded px-1 text-[10px] font-bold">
          E
        </span>
      ) : null}
    </Button>
  );
}

function buildTooltip(item: InventoryItem): string {
  const modifiers = item.modifiers.map((modifier) => formatModifier(modifier));
  return `${item.name} · ${formatRarity(item.rarity)}${
    modifiers.length > 0 ? `\n${modifiers.join(", ")}` : ""
  }`;
}

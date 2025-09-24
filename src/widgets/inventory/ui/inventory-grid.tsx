import type { InventoryItem } from "@/entities/inventory/model/types";
import type { EquipmentSlot } from "@/entities/dashboard/model/types";
import {
  formatModifier,
  formatRarity,
} from "@/entities/dashboard/lib/formatters";

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

export function InventoryGrid({
  items,
  selectedItemId,
  onSelect,
}: InventoryGridProps) {
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
    <div className="rounded-lg border-2 border-neutral-800 bg-neutral-900/70 p-4 shadow-[0_0_0_2px_rgba(255,255,255,0.03)]">
      <h2 className="mb-4 text-sm font-semibold tracking-[0.2em] text-neutral-400 uppercase">
        INVENTORY
      </h2>
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
            isSelected={Boolean(item && item.id === selectedItemId)}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

interface InventoryGridCellProps {
  item: InventoryItem | null;
  isSelected: boolean;
  onSelect: (item: InventoryItem) => void;
}

function InventoryGridCell({
  item,
  isSelected,
  onSelect,
}: InventoryGridCellProps) {
  if (!item) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-md border-[3px] border-neutral-800 bg-neutral-950/80 text-[10px] tracking-widest text-neutral-700 uppercase">
        Empty
      </div>
    );
  }

  const tooltip = buildTooltip(item);

  return (
    <button
      type="button"
      title={tooltip}
      onClick={() => onSelect(item)}
      className={[
        "relative flex aspect-square flex-col items-center justify-center gap-2 rounded-md border-[3px] border-neutral-800 bg-neutral-950/90 p-2 transition",
        item.isEquipped ? "border-primary" : "hover:border-primary",
        isSelected ? "shadow-[0_0_0_3px_rgba(249,115,22,0.35)]" : "shadow-none",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <img
        src={item.sprite}
        alt={item.name}
        loading="lazy"
        className="pointer-events-none h-14 w-14 object-cover"
      />
      <span className="truncate text-[11px] font-medium text-neutral-200">
        {item.name}
      </span>
      {item.isEquipped ? (
        <span className="bg-primary text-primary-foreground absolute top-1 left-1 rounded px-1 text-[10px] font-bold">
          E
        </span>
      ) : null}
    </button>
  );
}

function buildTooltip(item: InventoryItem): string {
  const modifiers = item.modifiers.map((modifier) => formatModifier(modifier));
  return `${item.name} · ${formatRarity(item.rarity)}${
    modifiers.length > 0 ? `\n${modifiers.join(", ")}` : ""
  }`;
}

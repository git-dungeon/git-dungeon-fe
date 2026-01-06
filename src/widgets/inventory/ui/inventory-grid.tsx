import type {
  InventoryItem,
  InventoryItemSlot,
} from "@/entities/inventory/model/types";
import { InventoryItemCard } from "@/entities/inventory/ui/inventory-item-card";
import { PixelSlotButton } from "@/shared/ui/pixel-slot-button";
import { PixelCheckbox } from "@/shared/ui/pixel-checkbox";
import { useTranslation } from "react-i18next";
import { useCatalogItemNameResolver } from "@/entities/catalog/model/use-catalog-item-name";
import { PixelPanel } from "@/shared/ui/pixel-panel";

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

export function InventoryGrid({
  items,
  selectedItemId,
  onSelect,
}: InventoryGridProps) {
  const { t } = useTranslation();
  const resolveItemName = useCatalogItemNameResolver();
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
    <PixelPanel title={t("inventory.grid.title")}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {sortedItems.map((item) => (
          <InventoryGridCell
            key={item.id}
            item={item}
            isSelected={item.id === selectedItemId}
            onSelect={onSelect}
            resolveItemName={resolveItemName}
          />
        ))}
      </div>
    </PixelPanel>
  );
}

interface InventoryGridCellProps {
  item: InventoryItem;
  isSelected: boolean;
  onSelect: (item: InventoryItem) => void;
  resolveItemName: (code: string, fallback?: string | null) => string;
}

function InventoryGridCell({
  item,
  isSelected,
  onSelect,
  resolveItemName,
}: InventoryGridCellProps) {
  const { t } = useTranslation();
  const displayName = resolveItemName(item.code, item.name);
  return (
    <PixelSlotButton
      type="button"
      title={displayName}
      onClick={() => onSelect(item)}
      selected={isSelected}
      className="group relative flex aspect-square h-auto w-full items-center justify-center p-2"
    >
      <InventoryItemCard
        item={item}
        displayName={displayName}
        showSlotLabel={false}
        showRarity={false}
        showModifiers={false}
        showEffect={false}
        truncateName={false}
        nameClassName="text-[11px]"
        className="pointer-events-none"
      />
      {item.isEquipped ? (
        <PixelCheckbox
          checked
          className="absolute top-1 left-1"
          aria-label={t("inventory.grid.equipped")}
          title={t("inventory.grid.equipped")}
          role="img"
        />
      ) : null}
    </PixelSlotButton>
  );
}

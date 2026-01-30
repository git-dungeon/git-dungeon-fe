import type { InventoryItem } from "@/entities/inventory/model/types";
import { InventoryItemCard } from "@/entities/inventory/ui/inventory-item-card";
import { PixelSlotButton } from "@/shared/ui/pixel-slot-button";
import { PixelCheckIcon } from "@/shared/ui/pixel-check-icon";
import { useTranslation } from "react-i18next";
import { useInventoryItemNameResolver } from "@/entities/inventory/model/use-inventory-item-name";
import { PixelPanel } from "@/shared/ui/pixel-panel";
import { PixelEmptyState } from "@/shared/ui/pixel-state";

interface InventoryGridProps {
  items: InventoryItem[];
  selectedItemId?: string | null;
  onSelect: (item: InventoryItem) => void;
}

export function InventoryGrid({
  items,
  selectedItemId,
  onSelect,
}: InventoryGridProps) {
  const { t } = useTranslation();
  const resolveItemName = useInventoryItemNameResolver();

  return (
    <PixelPanel title={t("inventory.grid.title")}>
      {items.length === 0 ? (
        <PixelEmptyState message={t("inventory.empty")} />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((item) => (
            <InventoryGridCell
              key={item.id}
              item={item}
              isSelected={item.id === selectedItemId}
              onSelect={onSelect}
              resolveItemName={resolveItemName}
            />
          ))}
        </div>
      )}
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
        <PixelCheckIcon
          className="absolute top-1 left-1"
          size={24}
          tone="success"
          title={t("inventory.grid.equipped")}
        />
      ) : null}
    </PixelSlotButton>
  );
}

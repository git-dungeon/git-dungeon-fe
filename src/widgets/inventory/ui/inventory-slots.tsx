import type {
  InventoryEquippedMap,
  InventoryItem,
} from "@/entities/inventory/model/types";
import type { EquipmentSlot } from "@/entities/dashboard/model/types";
import { PixelPanel } from "@/shared/ui/pixel-panel";
import { PixelSlotButton } from "@/shared/ui/pixel-slot-button";
import {
  EquipmentSlotGrid,
  InventoryEmptySlot,
} from "@/entities/inventory/ui/equipment-slot-grid";
import { InventoryItemCard } from "@/entities/inventory/ui/inventory-item-card";
import { useTranslation } from "react-i18next";
import { useCatalogItemNameResolver } from "@/entities/catalog/model/use-catalog-item-name";

interface InventorySlotsProps {
  equipped: InventoryEquippedMap;
  selectedItemId?: string | null;
  onSelect: (item: InventoryItem, slot: EquipmentSlot) => void;
}

export function InventorySlots({
  equipped,
  selectedItemId,
  onSelect,
}: InventorySlotsProps) {
  const { t } = useTranslation();
  const resolveItemName = useCatalogItemNameResolver();
  return (
    <PixelPanel title={t("inventory.slots.title")} className="h-full">
      <EquipmentSlotGrid
        equipped={equipped}
        columns={4}
        renderSlot={(slot, item) => (
          <PixelSlotButton
            key={slot}
            type="button"
            onClick={() => {
              if (item) {
                onSelect(item, slot);
              }
            }}
            title={item ? resolveItemName(item.code, item.name) : undefined}
            selected={Boolean(item && selectedItemId === item.id)}
            className="group flex h-auto w-full flex-col items-center justify-center gap-2 p-3 text-center transition"
          >
            {item ? (
              <InventoryItemCard
                item={item}
                displayName={resolveItemName(item.code, item.name)}
              />
            ) : (
              <InventoryEmptySlot slot={slot} />
            )}
          </PixelSlotButton>
        )}
      />
    </PixelPanel>
  );
}

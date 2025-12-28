import type {
  InventoryEquippedMap,
  InventoryItem,
} from "@/entities/inventory/model/types";
import type { EquipmentSlot } from "@/entities/dashboard/model/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import {
  EquipmentSlotGrid,
  InventoryEmptySlot,
} from "@/entities/inventory/ui/equipment-slot-grid";
import { InventoryItemCard } from "@/entities/inventory/ui/inventory-item-card";
import { cn } from "@/shared/lib/utils";
import { useTranslation } from "react-i18next";

interface InventorySlotsProps {
  equipped: InventoryEquippedMap;
  selectedItemId?: string | null;
  onSelect: (item: InventoryItem, slot: EquipmentSlot) => void;
}

export function InventorySlots({ equipped, onSelect }: InventorySlotsProps) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {t("inventory.slots.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EquipmentSlotGrid
          equipped={equipped}
          renderSlot={(slot, item) => (
            <Button
              key={slot}
              type="button"
              variant="outline"
              onClick={() => {
                if (item) {
                  onSelect(item, slot);
                }
              }}
              title={item ? (item.name ?? item.code) : undefined}
              className={cn(
                "group bg-background flex h-auto w-full flex-col items-center justify-center gap-2 p-3 text-center transition"
              )}
            >
              {item ? (
                <InventoryItemCard item={item} />
              ) : (
                <InventoryEmptySlot slot={slot} />
              )}
            </Button>
          )}
        />
      </CardContent>
    </Card>
  );
}

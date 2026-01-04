import { Fragment, useMemo, type ReactNode } from "react";
import type {
  InventoryEquippedMap,
  InventoryItem,
} from "@/entities/inventory/model/types";
import {
  EQUIPMENT_SLOTS,
  type EquipmentSlot,
} from "@/entities/dashboard/model/types";
import { InventoryItemCard } from "@/entities/inventory/ui/inventory-item-card";
import { getInventorySlotLabel } from "@/entities/inventory/config/slot-labels";
import { useTranslation } from "react-i18next";
import { useCatalogItemNameResolver } from "@/entities/catalog/model/use-catalog-item-name";
import { cn } from "@/shared/lib/utils";

interface EquipmentSlotGridProps {
  equipped: InventoryEquippedMap | InventoryItem[];
  className?: string;
  columns?: 2 | 4;
  renderSlot?: (
    slot: EquipmentSlot,
    item: InventoryItem | null,
    content: ReactNode
  ) => ReactNode;
}

export function EquipmentSlotGrid({
  equipped,
  className,
  columns = 2,
  renderSlot,
}: EquipmentSlotGridProps) {
  const resolveItemName = useCatalogItemNameResolver();
  const resolved = useMemo(() => {
    return Array.isArray(equipped) ? mapFromItems(equipped) : equipped;
  }, [equipped]);

  const gridClassName = cn(
    "grid gap-3",
    columns === 4 ? "grid-cols-4" : "grid-cols-2"
  );

  return (
    <div className={className}>
      <div className={gridClassName}>
        {EQUIPMENT_SLOTS.map((slot) => {
          const item = resolved[slot] ?? null;
          const baseContent = (
            <div className="border-border bg-background flex h-auto w-full flex-col items-center justify-center gap-2 rounded-lg border p-3 text-center">
              {item ? (
                <InventoryItemCard
                  item={item}
                  className="items-center"
                  showSlotLabel
                  displayName={resolveItemName(item.code, item.name)}
                />
              ) : (
                <InventoryEmptySlot slot={slot} />
              )}
            </div>
          );

          if (renderSlot) {
            return (
              <Fragment key={slot}>
                {renderSlot(slot, item, baseContent)}
              </Fragment>
            );
          }

          return <Fragment key={slot}>{baseContent}</Fragment>;
        })}
      </div>
    </div>
  );
}

export function InventoryEmptySlot({ slot }: { slot: EquipmentSlot }) {
  const { t } = useTranslation();
  return (
    <div className="flex w-full flex-col items-center gap-2 text-center">
      <div className="pixel-slot__placeholder flex size-14 items-center justify-center rounded-md" />
      <div className="space-y-1">
        <p className="text-xs font-semibold tracking-wide">
          {getInventorySlotLabel(slot)}
        </p>
        <p className="text-muted-foreground text-[11px]">
          {t("inventory.slots.empty")}
        </p>
      </div>
    </div>
  );
}

function mapFromItems(items: InventoryItem[]) {
  return EQUIPMENT_SLOTS.reduce<Record<EquipmentSlot, InventoryItem | null>>(
    (acc, slot) => {
      acc[slot] = items.find((item) => item.slot === slot) ?? null;
      return acc;
    },
    {
      helmet: null,
      armor: null,
      weapon: null,
      ring: null,
    }
  );
}

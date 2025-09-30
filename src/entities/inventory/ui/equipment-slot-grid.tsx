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

interface EquipmentSlotGridProps {
  equipped: InventoryEquippedMap | InventoryItem[];
  className?: string;
  renderSlot?: (
    slot: EquipmentSlot,
    item: InventoryItem | null,
    content: ReactNode
  ) => ReactNode;
}

export function EquipmentSlotGrid({
  equipped,
  className,
  renderSlot,
}: EquipmentSlotGridProps) {
  const resolved = useMemo(() => {
    return Array.isArray(equipped) ? mapFromItems(equipped) : equipped;
  }, [equipped]);

  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-3">
        {EQUIPMENT_SLOTS.map((slot) => {
          const item = resolved[slot] ?? null;
          const baseContent = (
            <div className="border-border bg-background flex h-auto w-full flex-col items-center justify-center gap-2 rounded-lg border p-3 text-center">
              {item ? (
                <InventoryItemCard
                  item={item}
                  className="items-center"
                  showSlotLabel
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

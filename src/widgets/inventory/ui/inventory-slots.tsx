import type {
  InventoryEquippedMap,
  InventoryItem,
} from "@/entities/inventory/model/types";
import {
  formatModifier,
  formatRarity,
} from "@/entities/dashboard/lib/formatters";
import type { EquipmentSlot } from "@/entities/dashboard/model/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

interface InventorySlotsProps {
  equipped: InventoryEquippedMap;
  selectedItemId?: string | null;
  onSelect: (item: InventoryItem, slot: EquipmentSlot) => void;
}

const SLOT_LABEL_MAP: Record<EquipmentSlot, string> = {
  helmet: "투구",
  armor: "방어구",
  weapon: "무기",
  ring: "반지",
};

export function InventorySlots({ equipped, onSelect }: InventorySlotsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">장착 슬롯</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {(
            Object.entries(equipped) as Array<
              [EquipmentSlot, InventoryItem | null]
            >
          ).map(([slot, item]) => (
            <Button
              key={slot}
              type="button"
              variant="outline"
              onClick={() => {
                if (item) {
                  onSelect(item, slot);
                }
              }}
              title={item ? buildTooltip(item) : undefined}
              className={cn(
                "group flex h-auto flex-col items-center justify-center gap-2 text-center transition"
              )}
            >
              <div className="flex size-14 items-center justify-center">
                {item ? (
                  <img
                    src={item.sprite}
                    alt={item.name}
                    className="size-14 object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="border-foreground size-14 rounded-lg border-1 border-dashed" />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold tracking-wide">
                  {SLOT_LABEL_MAP[slot]}
                </p>
                <p className="text-[11px]">{item ? item.name : "장비 없음"}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function buildTooltip(item: InventoryItem): string {
  const modifiers = item.modifiers.map((modifier) => formatModifier(modifier));
  return `${item.name} · ${formatRarity(item.rarity)}${
    modifiers.length > 0 ? `\n${modifiers.join(", ")}` : ""
  }`;
}

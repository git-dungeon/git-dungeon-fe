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

export function InventorySlots({
  equipped,
  selectedItemId,
  onSelect,
}: InventorySlotsProps) {
  return (
    <Card className="bg-neutral-900/60 text-neutral-100 shadow-[0_0_0_2px_rgba(255,255,255,0.05)]">
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
            <button
              key={slot}
              type="button"
              onClick={() => {
                if (item) {
                  onSelect(item, slot);
                }
              }}
              title={item ? buildTooltip(item) : undefined}
              className={[
                "group flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-neutral-700 bg-neutral-800/80 p-3 text-center transition",
                item
                  ? "hover:border-primary focus-visible:border-primary"
                  : "opacity-60",
                selectedItemId && item && selectedItemId === item.id
                  ? "border-primary shadow-[0_0_0_3px_rgba(249,115,22,0.25)]"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="flex size-14 items-center justify-center rounded-md border border-neutral-700 bg-neutral-900">
                {item ? (
                  <img
                    src={item.sprite}
                    alt={item.name}
                    className="size-12 object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-xs text-neutral-500">빈 슬롯</span>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold tracking-wide">
                  {SLOT_LABEL_MAP[slot]}
                </p>
                <p className="text-[11px] text-neutral-300">
                  {item ? item.name : "장비 없음"}
                </p>
              </div>
            </button>
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

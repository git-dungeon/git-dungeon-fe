import { useState } from "react";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  formatModifier,
  formatRarity,
} from "@/entities/dashboard/lib/formatters";
import type { InventoryItem } from "@/entities/inventory/model/types";
import { useEquipItem } from "@/features/inventory/model/use-equip-item";

interface InventoryItemsProps {
  items: InventoryItem[];
}

type InventorySlot = InventoryItem["slot"];

const SLOT_LABEL_MAP: Record<InventorySlot, string> = {
  weapon: "무기",
  armor: "방어구",
};

const obtainedAtFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function InventoryItems({ items }: InventoryItemsProps) {
  const equipMutation = useEquipItem();
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const groupedItems = groupItemsBySlot(items);

  const handleEquip = async (itemId: string) => {
    setActiveItemId(itemId);
    try {
      await equipMutation.mutateAsync({ itemId });
    } finally {
      setActiveItemId(null);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {Object.entries(groupedItems).map(([slot, slotItems]) => (
        <Card key={slot}>
          <CardHeader>
            <CardTitle className="text-lg">
              {SLOT_LABEL_MAP[slot as InventorySlot]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {slotItems.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                보유 중인 아이템이 없습니다.
              </p>
            ) : (
              <ul className="space-y-4">
                {slotItems.map((item) => {
                  const isEquipped = item.isEquipped;
                  const isPending =
                    equipMutation.isPending && activeItemId === item.id;

                  return (
                    <li
                      key={item.id}
                      className="border-border/80 bg-background/40 rounded-lg border p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-foreground text-sm font-semibold">
                              {item.name}
                            </span>
                            <Badge variant="secondary">
                              {formatRarity(item.rarity)}
                            </Badge>
                            {isEquipped ? (
                              <Badge className="bg-emerald-600/90 text-white">
                                장착 중
                              </Badge>
                            ) : null}
                          </div>
                          <p className="text-muted-foreground text-xs">
                            획득: {formatObtainedAt(item.obtainedAt)}
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={isEquipped || equipMutation.isPending}
                          onClick={() => handleEquip(item.id)}
                          className="border-input bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex items-center justify-center rounded-md border px-3 py-1 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isEquipped
                            ? "장착됨"
                            : isPending
                              ? "장착 중..."
                              : "장착"}
                        </button>
                      </div>
                      {item.modifiers.length > 0 ? (
                        <ul className="text-muted-foreground mt-3 flex flex-wrap gap-2 text-xs">
                          {item.modifiers.map((modifier, index) => (
                            <li
                              key={`${item.id}-modifier-${index}`}
                              className="bg-muted rounded-full px-2 py-1"
                            >
                              {formatModifier(modifier)}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function groupItemsBySlot(
  items: InventoryItem[]
): Record<InventorySlot, InventoryItem[]> {
  const initial: Record<InventorySlot, InventoryItem[]> = {
    weapon: [],
    armor: [],
  };

  const grouped = items.reduce((accumulator, item) => {
    accumulator[item.slot].push(item);
    return accumulator;
  }, initial);

  (Object.values(grouped) as InventoryItem[][]).forEach((slotItems) => {
    slotItems.sort((a, b) => {
      if (a.isEquipped !== b.isEquipped) {
        return a.isEquipped ? -1 : 1;
      }

      return (
        new Date(b.obtainedAt).getTime() - new Date(a.obtainedAt).getTime()
      );
    });
  });

  return grouped;
}

function formatObtainedAt(value: string): string {
  return obtainedAtFormatter.format(new Date(value));
}

import type { InventoryItemEffect } from "@/entities/inventory/model/types";

const EFFECT_LABEL_MAP: Record<string, string> = {
  resurrection: "부활",
};

export function formatInventoryEffect(effect: InventoryItemEffect): string {
  return EFFECT_LABEL_MAP[effect.type] ?? effect.type;
}

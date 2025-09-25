import type { InventoryItemEffect } from "@/entities/inventory/model/types";

const EFFECT_LABEL_MAP: Record<string, string> = {
  resurrection: "부활",
};

const obtainedAtFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatObtainedAt(value: string): string {
  return obtainedAtFormatter.format(new Date(value));
}

export function formatInventoryEffect(effect: InventoryItemEffect): string {
  return EFFECT_LABEL_MAP[effect.type] ?? effect.type;
}

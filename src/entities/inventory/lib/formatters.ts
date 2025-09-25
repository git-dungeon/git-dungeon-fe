import type { InventoryItem } from "@/entities/inventory/model/types";
import {
  formatModifier,
  formatRarity,
} from "@/entities/dashboard/lib/formatters";

const obtainedAtFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatObtainedAt(value: string): string {
  return obtainedAtFormatter.format(new Date(value));
}

export function buildInventoryItemTooltip(item: InventoryItem): string {
  const modifiers = item.modifiers.map((modifier) => formatModifier(modifier));
  return `${item.name} · ${formatRarity(item.rarity)}${
    modifiers.length > 0 ? `\n${modifiers.join(", ")}` : ""
  }`;
}

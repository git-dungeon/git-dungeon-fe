import { i18next } from "@/shared/i18n/i18n";

export function formatInventoryEffect(effect: string): string {
  const key = `inventory.effects.${effect}`;
  const value = i18next.t(key);
  return value === key ? effect : value;
}

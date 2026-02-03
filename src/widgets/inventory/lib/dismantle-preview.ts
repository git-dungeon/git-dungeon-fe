import type {
  EquipmentRarity,
  InventoryItem,
  InventoryItemSlot,
} from "@/entities/inventory/model/types";
import type { CatalogDismantleConfig } from "@/entities/catalog/model/types";

const MATERIAL_CODE_BY_SLOT: Record<InventoryItemSlot, string | null> = {
  helmet: "material-leather-scrap",
  armor: "material-cloth-scrap",
  weapon: "material-metal-scrap",
  ring: "material-mithril-dust",
  consumable: null,
  material: null,
};

const MATERIAL_QUANTITY_BY_RARITY: Record<EquipmentRarity, number> = {
  common: 1,
  uncommon: 2,
  rare: 3,
  epic: 4,
  legendary: 5,
};

export interface DismantlePreviewItem {
  code: string;
  quantity: number;
}

export function buildDismantlePreview(
  item: InventoryItem,
  config?: CatalogDismantleConfig | null
): DismantlePreviewItem[] {
  const materialCode = MATERIAL_CODE_BY_SLOT[item.slot];
  if (!materialCode) {
    return [];
  }

  const rarity = item.rarity ?? "common";
  const baseQuantity =
    config?.baseMaterialQuantityByRarity?.[rarity] ??
    MATERIAL_QUANTITY_BY_RARITY[rarity];
  const enhancementLevel = Math.max(0, Math.floor(item.enhancementLevel ?? 0));
  const refundQuantity =
    config?.refundByEnhancementLevel?.[String(enhancementLevel)] ?? 0;
  const quantity = baseQuantity + refundQuantity;

  return [{ code: materialCode, quantity }];
}

export function canDismantleItem(item: InventoryItem): boolean {
  if (item.isEquipped) {
    return false;
  }
  return Boolean(MATERIAL_CODE_BY_SLOT[item.slot]);
}

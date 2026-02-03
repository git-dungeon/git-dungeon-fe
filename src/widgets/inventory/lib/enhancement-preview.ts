import type {
  CatalogEnhancementConfig,
  EnhancementSlot,
} from "@/entities/catalog/model/types";
import type { InventoryItemSlot } from "@/entities/inventory/model/types";

const BONUS_STAT_BY_SLOT: Record<EnhancementSlot, "atk" | "def" | "luck"> = {
  weapon: "atk",
  armor: "def",
  helmet: "def",
  ring: "luck",
};

export interface EnhancementPreview {
  slot: EnhancementSlot;
  currentLevel: number;
  nextLevel: number;
  isMaxLevel: boolean;
  successRate: number | null;
  goldCost: number | null;
  materialCount: number | null;
  materialCode: string | null;
  bonusStat: "atk" | "def" | "luck";
  currentBonus: number;
  nextBonus: number;
}

export function buildEnhancementPreview(
  slot: InventoryItemSlot,
  enhancementLevel: number | null | undefined,
  config: CatalogEnhancementConfig
): EnhancementPreview | null {
  const enhancementSlot = toEnhancementSlot(slot);
  if (!enhancementSlot) {
    return null;
  }

  const safeCurrentLevel = Math.max(0, Math.floor(enhancementLevel ?? 0));
  const cappedCurrentLevel = Math.min(safeCurrentLevel, config.maxLevel);
  const isMaxLevel = cappedCurrentLevel >= config.maxLevel;
  const nextLevel = isMaxLevel ? cappedCurrentLevel : cappedCurrentLevel + 1;

  return {
    slot: enhancementSlot,
    currentLevel: cappedCurrentLevel,
    nextLevel,
    isMaxLevel,
    successRate: isMaxLevel
      ? null
      : readLevelNumber(config.successRates, nextLevel),
    goldCost: isMaxLevel ? null : readLevelNumber(config.goldCosts, nextLevel),
    materialCount: isMaxLevel
      ? null
      : readLevelNumber(config.materialCounts, nextLevel),
    materialCode: isMaxLevel
      ? null
      : (config.materialsBySlot[enhancementSlot] ?? null),
    bonusStat: BONUS_STAT_BY_SLOT[enhancementSlot],
    currentBonus: cappedCurrentLevel,
    nextBonus: nextLevel,
  };
}

function readLevelNumber(
  table: Record<string, number>,
  level: number
): number | null {
  const value = table[String(level)];
  return typeof value === "number" ? value : null;
}

function toEnhancementSlot(slot: InventoryItemSlot): EnhancementSlot | null {
  switch (slot) {
    case "weapon":
    case "armor":
    case "helmet":
    case "ring":
      return slot;
    default:
      return null;
  }
}

import type { InventoryItemSlot } from "@/entities/inventory/model/types";

type EnhancementStat = "atk" | "def" | "luck";

const BONUS_STAT_BY_SLOT: Partial<Record<InventoryItemSlot, EnhancementStat>> =
  {
    weapon: "atk",
    armor: "def",
    helmet: "def",
    ring: "luck",
  };

export function resolveEnhancementLevel(
  level: number | null | undefined
): number {
  if (typeof level !== "number" || Number.isNaN(level)) {
    return 0;
  }
  return Math.max(0, Math.floor(level));
}

export function formatEnhancementStars(
  level: number | null | undefined
): string | null {
  const resolvedLevel = resolveEnhancementLevel(level);
  return resolvedLevel > 0 ? `★${resolvedLevel}` : null;
}

export function resolveEnhancementBonus(
  slot: InventoryItemSlot,
  level: number | null | undefined
): { stat: EnhancementStat; value: number } | null {
  const resolvedLevel = resolveEnhancementLevel(level);
  if (resolvedLevel <= 0) {
    return null;
  }

  const stat = BONUS_STAT_BY_SLOT[slot];
  if (!stat) {
    return null;
  }

  return { stat, value: resolvedLevel };
}

import type { DashboardState } from "@/entities/dashboard/model/types";
import type {
  InventoryItem,
  InventoryResponse,
} from "@/entities/inventory/model/types";

export interface CharacterStatValues {
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  luck: number;
  ap: number;
}

export interface CharacterStatModifier {
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  luck: number;
  ap: number;
}

export interface CharacterStatSummary {
  total: CharacterStatValues;
  base: CharacterStatValues;
  equipmentBonus: CharacterStatModifier;
}

export interface CharacterOverview {
  level: number;
  exp: number;
  expToLevel: number;
  gold: number;
  ap: number;
  floor: {
    current: number;
    best: number;
    progress: number;
  };
  stats: CharacterStatSummary;
  equipment: InventoryItem[];
}

const DEFAULT_MODIFIER: CharacterStatModifier = {
  hp: 0,
  maxHp: 0,
  atk: 0,
  def: 0,
  luck: 0,
  ap: 0,
};

export function buildCharacterOverview(
  state: DashboardState,
  inventory: InventoryResponse
): CharacterOverview {
  const equippedItems = extractEquippedItems(inventory);
  const equipmentBonus = resolveEquipmentBonus(state, inventory, equippedItems);
  const totalStats = extractTotalStats(state);
  const baseStats = calculateBaseStats(totalStats, equipmentBonus);
  const expToLevel = resolveExpToLevel(state);

  return {
    level: state.level,
    exp: state.exp,
    expToLevel,
    gold: state.gold,
    ap: state.ap,
    floor: {
      current: state.floor,
      best: state.maxFloor,
      progress: state.floorProgress,
    },
    stats: {
      total: totalStats,
      base: baseStats,
      equipmentBonus,
    },
    equipment: equippedItems,
  };
}

function resolveExpToLevel(state: DashboardState): number {
  const expToLevel = state.expToLevel;
  if (typeof expToLevel === "number" && Number.isFinite(expToLevel)) {
    return Math.max(0, expToLevel);
  }

  return Math.max(0, state.level * 10);
}

function extractEquippedItems(inventory: InventoryResponse): InventoryItem[] {
  const equipped = inventory.equipped;

  return [equipped.helmet, equipped.armor, equipped.weapon, equipped.ring]
    .filter(Boolean)
    .map((item) => ({ ...item!, isEquipped: true }));
}

function extractTotalStats(state: DashboardState): CharacterStatValues {
  return {
    hp: state.hp,
    maxHp: state.maxHp,
    atk: state.atk,
    def: state.def,
    luck: state.luck,
    ap: state.ap,
  };
}

function calculateEquipmentBonus(
  items: InventoryItem[]
): CharacterStatModifier {
  if (items.length === 0) {
    return { ...DEFAULT_MODIFIER };
  }

  return items.reduce<CharacterStatModifier>(
    (acc, item) => {
      item.modifiers.forEach((modifier) => {
        if (modifier.kind !== "stat") {
          return;
        }
        if (modifier.mode !== "flat") {
          return;
        }

        switch (modifier.stat) {
          case "hp":
            acc.hp += modifier.value;
            acc.maxHp += modifier.value;
            break;
          case "atk":
            acc.atk += modifier.value;
            break;
          case "def":
            acc.def += modifier.value;
            break;
          case "luck":
            acc.luck += modifier.value;
            break;
          default:
            break;
        }
      });
      return acc;
    },
    { ...DEFAULT_MODIFIER }
  );
}

function resolveEquipmentBonus(
  state: DashboardState,
  inventory: InventoryResponse,
  equippedItems: InventoryItem[]
): CharacterStatModifier {
  const breakdown = state.stats?.equipmentBonus;
  if (breakdown) {
    return buildModifierFromStatBlock(breakdown);
  }

  const summaryBonus = inventory.summary?.equipmentBonus;
  if (summaryBonus) {
    return buildModifierFromStatBlock(summaryBonus);
  }

  return calculateEquipmentBonus(equippedItems);
}

function buildModifierFromStatBlock(block: {
  hp: number;
  maxHp?: number;
  atk: number;
  def: number;
  luck: number;
}): CharacterStatModifier {
  return {
    ...DEFAULT_MODIFIER,
    hp: block.hp,
    maxHp: block.maxHp ?? block.hp,
    atk: block.atk,
    def: block.def,
    luck: block.luck,
  };
}

function calculateBaseStats(
  total: CharacterStatValues,
  equipment: CharacterStatModifier
): CharacterStatValues {
  return {
    hp: clampStat(total.hp - equipment.hp, total.hp),
    maxHp: clampStat(total.maxHp - equipment.maxHp, total.maxHp),
    atk: clampStat(total.atk - equipment.atk, total.atk),
    def: clampStat(total.def - equipment.def, total.def),
    luck: clampStat(total.luck - equipment.luck, total.luck),
    ap: clampStat(total.ap - equipment.ap, total.ap),
  };
}

function clampStat(value: number, fallback: number): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(0, value);
}

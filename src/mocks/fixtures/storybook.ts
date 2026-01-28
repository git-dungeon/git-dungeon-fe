import type { DungeonLogEntry } from "@/entities/dungeon-log/model/types";
import type {
  InventoryEquippedMap,
  InventoryItem,
} from "@/entities/inventory/model/types";
import type {
  CharacterOverview,
  CharacterStatSummary,
} from "@/features/character-summary/lib/build-character-overview";
import { mockDashboardResponse } from "@/mocks/handlers/dashboard-handlers";
import { mockDungeonLogs } from "@/mocks/handlers/dungeon-log-handlers";
import { mockProfileOverview } from "@/mocks/fixtures/profile-overview";

export const sampleDashboardState = mockDashboardResponse.state;

export const sampleDungeonLogs: DungeonLogEntry[] = mockDungeonLogs;

export const sampleProfileOverview = mockProfileOverview;

export const sampleInventoryItems: InventoryItem[] = [
  {
    id: "inv-weapon-longsword",
    code: "weapon-longsword",
    name: "Longsword",
    slot: "weapon",
    rarity: "rare",
    modifiers: [{ kind: "stat", stat: "atk", mode: "flat", value: 5 }],
    effect: null,
    sprite: null,
    createdAt: "2026-01-18T12:00:00.000Z",
    isEquipped: true,
    quantity: 1,
    version: 1,
  },
  {
    id: "inv-helmet-steel",
    code: "helmet-steel-helm",
    name: "Steel Helm",
    slot: "helmet",
    rarity: "uncommon",
    modifiers: [
      { kind: "stat", stat: "def", mode: "flat", value: 4 },
      { kind: "stat", stat: "hp", mode: "flat", value: 2 },
    ],
    effect: null,
    sprite: null,
    createdAt: "2026-01-18T11:30:00.000Z",
    isEquipped: true,
    quantity: 1,
    version: 1,
  },
  {
    id: "inv-ring-topaz",
    code: "ring-topaz",
    name: "Topaz Ring",
    slot: "ring",
    rarity: "uncommon",
    modifiers: [{ kind: "stat", stat: "luck", mode: "flat", value: 2 }],
    effect: null,
    sprite: null,
    createdAt: "2026-01-18T10:10:00.000Z",
    isEquipped: false,
    quantity: 1,
    version: 1,
  },
  {
    id: "inv-armor-leather",
    code: "armor-leather-armor",
    name: "Leather Armor",
    slot: "armor",
    rarity: "common",
    modifiers: [{ kind: "stat", stat: "def", mode: "flat", value: 1 }],
    effect: "guard",
    sprite: null,
    createdAt: "2026-01-17T22:10:00.000Z",
    isEquipped: false,
    quantity: 1,
    version: 1,
  },
];

export const sampleEquippedMap: InventoryEquippedMap = {
  helmet: sampleInventoryItems[1],
  armor: sampleInventoryItems[3],
  weapon: sampleInventoryItems[0],
  ring: sampleInventoryItems[2],
  consumable: null,
  material: null,
};

const baseStats = sampleDashboardState.stats.base;
const totalStats = sampleDashboardState.stats.total;
const bonusStats = sampleDashboardState.stats.equipmentBonus;

export const sampleCharacterStats: CharacterStatSummary = {
  total: {
    ...totalStats,
    ap: sampleDashboardState.ap,
  },
  base: {
    ...baseStats,
    ap: sampleDashboardState.ap,
  },
  equipmentBonus: {
    ...bonusStats,
    ap: 0,
  },
};

export const sampleCharacterOverview: CharacterOverview = {
  level: sampleDashboardState.level,
  exp: sampleDashboardState.exp,
  expToLevel: sampleDashboardState.expToLevel ?? 80,
  gold: sampleDashboardState.gold,
  ap: sampleDashboardState.ap,
  floor: {
    current: sampleDashboardState.floor,
    best: sampleDashboardState.maxFloor,
    progress: sampleDashboardState.floorProgress,
  },
  stats: sampleCharacterStats,
  equipment: sampleInventoryItems.filter((item) => item.slot !== "consumable"),
};

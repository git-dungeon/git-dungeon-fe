import { http, HttpResponse } from "msw";
import { subMinutes } from "date-fns";
import { INVENTORY_ENDPOINTS } from "@/shared/config/env";
import type {
  InventoryEquippedMap,
  InventoryItem,
  InventoryItemEffect,
  InventoryResponse,
  InventoryStatValues,
} from "@/entities/inventory/model/types";
import type { EquipmentSlot } from "@/entities/dashboard/model/types";
import { mockDashboardResponse } from "@/mocks/handlers/dashboard-handlers";

let inventoryVersion = 1;

function createTimestamp(minutesAgo: number): string {
  return subMinutes(new Date(), minutesAgo).toISOString();
}

const RARITY_COLOR_MAP: Record<InventoryItem["rarity"], string> = {
  common: "#6b7280",
  uncommon: "#22c55e",
  rare: "#3b82f6",
  epic: "#a855f7",
  legendary: "#facc15",
};

function createSprite(label: string, color: string): string {
  const safeLabel = label.slice(0, 2).toUpperCase();
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='10' fill='${color}'/><text x='50%' y='52%' font-size='26' text-anchor='middle' fill='white' font-family='Inter, Arial, sans-serif' font-weight='700'>${safeLabel}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

interface RawInventoryItem {
  id: string;
  name: string;
  slot: EquipmentSlot;
  rarity: InventoryItem["rarity"];
  modifiers: InventoryItem["modifiers"];
  spriteLabel: string;
  obtainedMinutesAgo: number;
  isEquipped?: boolean;
  effect?: InventoryItemEffect;
}

const RAW_INVENTORY_ITEMS: RawInventoryItem[] = [
  // Helmets
  {
    id: "helmet-leather-cap",
    name: "Leather Cap",
    slot: "helmet",
    rarity: "common",
    modifiers: [{ stat: "def", value: 1 }],
    spriteLabel: "LC",
    obtainedMinutesAgo: 480,
  },
  {
    id: "helmet-iron-helm",
    name: "Iron Helm",
    slot: "helmet",
    rarity: "common",
    modifiers: [{ stat: "def", value: 2 }],
    spriteLabel: "IH",
    obtainedMinutesAgo: 420,
  },
  {
    id: "helmet-bronze-helm",
    name: "Bronze Helm",
    slot: "helmet",
    rarity: "uncommon",
    modifiers: [{ stat: "def", value: 3 }],
    spriteLabel: "BH",
    obtainedMinutesAgo: 360,
  },
  {
    id: "helmet-steel-helm",
    name: "Steel Helm",
    slot: "helmet",
    rarity: "uncommon",
    modifiers: [
      { stat: "def", value: 4 },
      { stat: "hp", value: 2 },
    ],
    spriteLabel: "SH",
    obtainedMinutesAgo: 120,
    isEquipped: true,
  },
  {
    id: "helmet-knights-helm",
    name: "Knight's Helm",
    slot: "helmet",
    rarity: "rare",
    modifiers: [{ stat: "def", value: 5 }],
    spriteLabel: "KH",
    obtainedMinutesAgo: 600,
  },
  {
    id: "helmet-horned-helm",
    name: "Horned Helm",
    slot: "helmet",
    rarity: "rare",
    modifiers: [
      { stat: "def", value: 6 },
      { stat: "atk", value: 1 },
    ],
    spriteLabel: "HH",
    obtainedMinutesAgo: 540,
  },
  {
    id: "helmet-dragon-helm",
    name: "Dragon Helm",
    slot: "helmet",
    rarity: "epic",
    modifiers: [
      { stat: "def", value: 7 },
      { stat: "hp", value: 5 },
    ],
    spriteLabel: "DH",
    obtainedMinutesAgo: 300,
  },
  {
    id: "helmet-shadow-hood",
    name: "Shadow Hood",
    slot: "helmet",
    rarity: "epic",
    modifiers: [
      { stat: "def", value: 8 },
      { stat: "luck", value: 2 },
    ],
    spriteLabel: "SD",
    obtainedMinutesAgo: 260,
  },
  {
    id: "helmet-mythril-helm",
    name: "Mythril Helm",
    slot: "helmet",
    rarity: "legendary",
    modifiers: [
      { stat: "def", value: 10 },
      { stat: "atk", value: -1 },
    ],
    spriteLabel: "MH",
    obtainedMinutesAgo: 900,
  },
  {
    id: "helmet-crown-of-valor",
    name: "Crown of Valor",
    slot: "helmet",
    rarity: "legendary",
    modifiers: [
      { stat: "def", value: 12 },
      { stat: "hp", value: 1 },
      { stat: "atk", value: 1 },
      { stat: "luck", value: 1 },
    ],
    spriteLabel: "CV",
    obtainedMinutesAgo: 1020,
  },
  // Armor
  {
    id: "armor-leather-armor",
    name: "Leather Armor",
    slot: "armor",
    rarity: "common",
    modifiers: [{ stat: "def", value: 1 }],
    spriteLabel: "LA",
    obtainedMinutesAgo: 510,
  },
  {
    id: "armor-iron-shield",
    name: "Iron Shield",
    slot: "armor",
    rarity: "common",
    modifiers: [{ stat: "def", value: 2 }],
    spriteLabel: "IS",
    obtainedMinutesAgo: 470,
  },
  {
    id: "armor-chainmail",
    name: "Chainmail",
    slot: "armor",
    rarity: "uncommon",
    modifiers: [{ stat: "def", value: 3 }],
    spriteLabel: "CM",
    obtainedMinutesAgo: 430,
  },
  {
    id: "armor-steel-armor",
    name: "Steel Armor",
    slot: "armor",
    rarity: "uncommon",
    modifiers: [
      { stat: "def", value: 4 },
      { stat: "luck", value: 1 },
    ],
    spriteLabel: "SA",
    obtainedMinutesAgo: 150,
    isEquipped: true,
  },
  {
    id: "armor-knights-plate",
    name: "Knight's Plate",
    slot: "armor",
    rarity: "rare",
    modifiers: [{ stat: "def", value: 5 }],
    spriteLabel: "KP",
    obtainedMinutesAgo: 690,
  },
  {
    id: "armor-tower-shield",
    name: "Tower Shield",
    slot: "armor",
    rarity: "rare",
    modifiers: [{ stat: "def", value: 6 }],
    spriteLabel: "TS",
    obtainedMinutesAgo: 630,
  },
  {
    id: "armor-guardian-armor",
    name: "Guardian Armor",
    slot: "armor",
    rarity: "epic",
    modifiers: [{ stat: "def", value: 7 }],
    spriteLabel: "GA",
    obtainedMinutesAgo: 320,
  },
  {
    id: "armor-dragon-scale",
    name: "Dragon Scale",
    slot: "armor",
    rarity: "epic",
    modifiers: [
      { stat: "def", value: 8 },
      { stat: "hp", value: 5 },
    ],
    spriteLabel: "DS",
    obtainedMinutesAgo: 210,
  },
  {
    id: "armor-mythril-armor",
    name: "Mythril Armor",
    slot: "armor",
    rarity: "legendary",
    modifiers: [
      { stat: "def", value: 10 },
      { stat: "atk", value: -1 },
    ],
    spriteLabel: "MA",
    obtainedMinutesAgo: 960,
  },
  {
    id: "armor-divine-cloak",
    name: "Divine Cloak",
    slot: "armor",
    rarity: "legendary",
    modifiers: [
      { stat: "def", value: 12 },
      { stat: "hp", value: 1 },
      { stat: "atk", value: 1 },
      { stat: "luck", value: 1 },
    ],
    spriteLabel: "DC",
    obtainedMinutesAgo: 1110,
  },
  // Weapons
  {
    id: "weapon-wooden-sword",
    name: "Wooden Sword",
    slot: "weapon",
    rarity: "common",
    modifiers: [{ stat: "atk", value: 1 }],
    spriteLabel: "WS",
    obtainedMinutesAgo: 520,
  },
  {
    id: "weapon-iron-dagger",
    name: "Iron Dagger",
    slot: "weapon",
    rarity: "common",
    modifiers: [{ stat: "atk", value: 2 }],
    spriteLabel: "ID",
    obtainedMinutesAgo: 460,
  },
  {
    id: "weapon-short-sword",
    name: "Short Sword",
    slot: "weapon",
    rarity: "uncommon",
    modifiers: [{ stat: "atk", value: 3 }],
    spriteLabel: "SS",
    obtainedMinutesAgo: 400,
  },
  {
    id: "weapon-steel-sword",
    name: "Steel Sword",
    slot: "weapon",
    rarity: "uncommon",
    modifiers: [
      { stat: "atk", value: 4 },
      { stat: "luck", value: 1 },
    ],
    spriteLabel: "ST",
    obtainedMinutesAgo: 340,
  },
  {
    id: "weapon-longsword",
    name: "Longsword",
    slot: "weapon",
    rarity: "rare",
    modifiers: [{ stat: "atk", value: 5 }],
    spriteLabel: "LS",
    obtainedMinutesAgo: 60,
    isEquipped: true,
  },
  {
    id: "weapon-battle-axe",
    name: "Battle Axe",
    slot: "weapon",
    rarity: "rare",
    modifiers: [{ stat: "atk", value: 6 }],
    spriteLabel: "BA",
    obtainedMinutesAgo: 280,
  },
  {
    id: "weapon-warhammer",
    name: "Warhammer",
    slot: "weapon",
    rarity: "epic",
    modifiers: [{ stat: "atk", value: 7 }],
    spriteLabel: "WH",
    obtainedMinutesAgo: 240,
  },
  {
    id: "weapon-greatsword",
    name: "Greatsword",
    slot: "weapon",
    rarity: "epic",
    modifiers: [
      { stat: "atk", value: 9 },
      { stat: "def", value: -1 },
    ],
    spriteLabel: "GS",
    obtainedMinutesAgo: 720,
  },
  {
    id: "weapon-spear-of-valor",
    name: "Spear of Valor",
    slot: "weapon",
    rarity: "legendary",
    modifiers: [
      { stat: "atk", value: 10 },
      { stat: "luck", value: 2 },
    ],
    spriteLabel: "SV",
    obtainedMinutesAgo: 180,
  },
  {
    id: "weapon-excalibur",
    name: "Excalibur",
    slot: "weapon",
    rarity: "legendary",
    modifiers: [
      { stat: "atk", value: 12 },
      { stat: "hp", value: 1 },
      { stat: "def", value: 1 },
      { stat: "luck", value: 1 },
    ],
    spriteLabel: "EX",
    obtainedMinutesAgo: 1260,
  },
  // Rings
  {
    id: "ring-copper-band",
    name: "Copper Band",
    slot: "ring",
    rarity: "common",
    modifiers: [{ stat: "luck", value: 1 }],
    spriteLabel: "CB",
    obtainedMinutesAgo: 500,
  },
  {
    id: "ring-silver-band",
    name: "Silver Band",
    slot: "ring",
    rarity: "common",
    modifiers: [{ stat: "luck", value: 2 }],
    spriteLabel: "SB",
    obtainedMinutesAgo: 440,
  },
  {
    id: "ring-garnet",
    name: "Garnet Ring",
    slot: "ring",
    rarity: "uncommon",
    modifiers: [{ stat: "hp", value: 3 }],
    spriteLabel: "GR",
    obtainedMinutesAgo: 380,
  },
  {
    id: "ring-topaz",
    name: "Topaz Ring",
    slot: "ring",
    rarity: "uncommon",
    modifiers: [
      { stat: "luck", value: 2 },
      { stat: "hp", value: 2 },
    ],
    spriteLabel: "TR",
    obtainedMinutesAgo: 100,
    isEquipped: true,
  },
  {
    id: "ring-sapphire",
    name: "Sapphire Ring",
    slot: "ring",
    rarity: "rare",
    modifiers: [{ stat: "luck", value: 3 }],
    spriteLabel: "SR",
    obtainedMinutesAgo: 340,
  },
  {
    id: "ring-emerald",
    name: "Emerald Ring",
    slot: "ring",
    rarity: "rare",
    modifiers: [{ stat: "hp", value: 5 }],
    spriteLabel: "ER",
    obtainedMinutesAgo: 620,
  },
  {
    id: "ring-ruby-signet",
    name: "Ruby Signet",
    slot: "ring",
    rarity: "epic",
    modifiers: [
      { stat: "atk", value: 1 },
      { stat: "luck", value: 2 },
    ],
    spriteLabel: "RS",
    obtainedMinutesAgo: 260,
  },
  {
    id: "ring-obsidian",
    name: "Obsidian Ring",
    slot: "ring",
    rarity: "epic",
    modifiers: [
      { stat: "def", value: 2 },
      { stat: "hp", value: 3 },
    ],
    spriteLabel: "OR",
    obtainedMinutesAgo: 700,
  },
  {
    id: "ring-mythril",
    name: "Mythril Ring",
    slot: "ring",
    rarity: "legendary",
    modifiers: [
      { stat: "luck", value: 4 },
      { stat: "atk", value: -1 },
    ],
    spriteLabel: "MR",
    obtainedMinutesAgo: 840,
  },
  {
    id: "ring-angel",
    name: "Angel Ring",
    slot: "ring",
    rarity: "legendary",
    modifiers: [],
    spriteLabel: "AR",
    obtainedMinutesAgo: 1340,
    effect: {
      type: "resurrection",
      description: "HP가 0이 되면 한 번 부활합니다",
    },
  },
];

const inventoryItems: InventoryItem[] = RAW_INVENTORY_ITEMS.map((item) => ({
  id: item.id,
  name: item.name,
  slot: item.slot,
  rarity: item.rarity,
  modifiers: item.modifiers.map((modifier) => ({ ...modifier })),
  effect: item.effect ? { ...item.effect } : undefined,
  sprite: createSprite(item.spriteLabel, RARITY_COLOR_MAP[item.rarity]),
  obtainedAt: createTimestamp(item.obtainedMinutesAgo),
  isEquipped: Boolean(item.isEquipped),
}));

interface InventoryActionRequestBody {
  itemId?: string;
}

const EMPTY_EQUIPPED: InventoryEquippedMap = {
  helmet: null,
  armor: null,
  weapon: null,
  ring: null,
};

function setDashboardSlot(slot: EquipmentSlot, item: InventoryItem | null) {
  const normalized = item
    ? {
        id: item.id,
        name: item.name,
        slot: item.slot,
        rarity: item.rarity,
        modifiers: item.modifiers,
        effect: item.effect ? { ...item.effect } : undefined,
      }
    : undefined;

  switch (slot) {
    case "helmet":
      mockDashboardResponse.state.equippedHelmet = normalized;
      break;
    case "armor":
      mockDashboardResponse.state.equippedArmor = normalized;
      break;
    case "weapon":
      mockDashboardResponse.state.equippedWeapon = normalized;
      break;
    case "ring":
      mockDashboardResponse.state.equippedRing = normalized;
      break;
    default:
      break;
  }
}

function buildEquippedMap(): InventoryEquippedMap {
  const equipped = { ...EMPTY_EQUIPPED };

  inventoryItems.forEach((item) => {
    if (item.isEquipped) {
      equipped[item.slot] = { ...item };
    }
  });

  (
    Object.entries(equipped) as Array<[EquipmentSlot, InventoryItem | null]>
  ).forEach(([slot, item]) => {
    setDashboardSlot(slot, item);
  });

  return equipped;
}

function buildInventoryResponse(): InventoryResponse {
  const equipped = buildEquippedMap();
  const { hp, atk, def, luck } = mockDashboardResponse.state;

  const equipmentBonus: InventoryStatValues = {
    hp: 0,
    atk: 0,
    def: 0,
    luck: 0,
  };

  Object.values(equipped).forEach((item) => {
    if (!item) {
      return;
    }

    item.modifiers.forEach((modifier) => {
      switch (modifier.stat) {
        case "hp":
          equipmentBonus.hp += modifier.value;
          break;
        case "atk":
          equipmentBonus.atk += modifier.value;
          break;
        case "def":
          equipmentBonus.def += modifier.value;
          break;
        case "luck":
          equipmentBonus.luck += modifier.value;
          break;
        default:
          break;
      }
    });
  });

  return {
    version: inventoryVersion,
    items: inventoryItems.map((item) => ({ ...item })),
    equipped,
    summary: {
      total: {
        hp,
        atk,
        def,
        luck,
      },
      equipmentBonus,
    },
  };
}

export const inventoryHandlers = [
  http.get(INVENTORY_ENDPOINTS.list, () => {
    return HttpResponse.json(buildInventoryResponse());
  }),
  http.post(INVENTORY_ENDPOINTS.equip, async ({ request }) => {
    const payload = (await request
      .json()
      .catch(() => null)) as InventoryActionRequestBody | null;

    if (!payload || typeof payload.itemId !== "string") {
      return HttpResponse.json(
        { message: "itemId가 필요합니다." },
        { status: 400 }
      );
    }

    const target = inventoryItems.find((item) => item.id === payload.itemId);

    if (!target) {
      return HttpResponse.json(
        { message: "존재하지 않는 아이템입니다." },
        { status: 404 }
      );
    }

    let changed = false;

    inventoryItems.forEach((item) => {
      if (item.slot === target.slot) {
        const nextEquipped = item.id === target.id;
        if (item.isEquipped !== nextEquipped) {
          item.isEquipped = nextEquipped;
          changed = true;
        }
      }
    });

    if (changed) {
      inventoryVersion += 1;
    }

    return HttpResponse.json(buildInventoryResponse());
  }),
  http.post(INVENTORY_ENDPOINTS.unequip, async ({ request }) => {
    const payload = (await request
      .json()
      .catch(() => null)) as InventoryActionRequestBody | null;

    if (!payload || typeof payload.itemId !== "string") {
      return HttpResponse.json(
        { message: "itemId가 필요합니다." },
        { status: 400 }
      );
    }

    const target = inventoryItems.find((item) => item.id === payload.itemId);

    if (!target) {
      return HttpResponse.json(
        { message: "존재하지 않는 아이템입니다." },
        { status: 404 }
      );
    }

    if (target.isEquipped) {
      target.isEquipped = false;
      inventoryVersion += 1;
    }

    return HttpResponse.json(buildInventoryResponse());
  }),
  http.post(INVENTORY_ENDPOINTS.discard, async ({ request }) => {
    const payload = (await request
      .json()
      .catch(() => null)) as InventoryActionRequestBody | null;

    if (!payload || typeof payload.itemId !== "string") {
      return HttpResponse.json(
        { message: "itemId가 필요합니다." },
        { status: 400 }
      );
    }

    const index = inventoryItems.findIndex(
      (item) => item.id === payload.itemId
    );

    if (index < 0) {
      return HttpResponse.json(
        { message: "존재하지 않는 아이템입니다." },
        { status: 404 }
      );
    }

    const [removed] = inventoryItems.splice(index, 1);

    inventoryVersion += 1;

    if (removed.isEquipped) {
      setDashboardSlot(removed.slot, null);
    }

    return HttpResponse.json(buildInventoryResponse());
  }),
];

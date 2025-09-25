import { http, HttpResponse } from "msw";
import { subMinutes } from "date-fns";
import { INVENTORY_ENDPOINTS } from "@/shared/config/env";
import type {
  InventoryEquippedMap,
  InventoryItem,
  InventoryResponse,
  InventoryStatValues,
} from "@/entities/inventory/model/types";
import type { EquipmentSlot } from "@/entities/dashboard/model/types";
import { mockDashboardResponse } from "@/mocks/handlers/dashboard-handlers";

function createTimestamp(minutesAgo: number): string {
  return subMinutes(new Date(), minutesAgo).toISOString();
}

const RARITY_COLOR_MAP = {
  common: "#6b7280",
  uncommon: "#22c55e",
  rare: "#3b82f6",
  epic: "#a855f7",
  legendary: "#facc15",
} as const;

function createSprite(label: string, color: string): string {
  const safeLabel = label.slice(0, 2).toUpperCase();
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='10' fill='${color}'/><text x='50%' y='52%' font-size='26' text-anchor='middle' fill='white' font-family='Inter, Arial, sans-serif' font-weight='700'>${safeLabel}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const inventoryItems: InventoryItem[] = [
  {
    id: "helmet-obsidian",
    name: "Obsidian Helm",
    slot: "helmet",
    rarity: "epic",
    modifiers: [
      { stat: "def", value: 6 },
      { stat: "hp", value: 8 },
    ],
    sprite: createSprite("Helm", RARITY_COLOR_MAP.epic),
    obtainedAt: createTimestamp(45),
    isEquipped: true,
  },
  {
    id: "helmet-leather-cap",
    name: "Leather Cap",
    slot: "helmet",
    rarity: "common",
    modifiers: [{ stat: "def", value: 1 }],
    sprite: createSprite("Cap", RARITY_COLOR_MAP.common),
    obtainedAt: createTimestamp(400),
    isEquipped: false,
  },
  {
    id: "helmet-mythril-crown",
    name: "Mythril Crown",
    slot: "helmet",
    rarity: "legendary",
    modifiers: [
      { stat: "def", value: 10 },
      { stat: "luck", value: 2 },
    ],
    sprite: createSprite("Crown", RARITY_COLOR_MAP.legendary),
    obtainedAt: createTimestamp(920),
    isEquipped: false,
  },
  {
    id: "helmet-steel-visage",
    name: "Steel Visage",
    slot: "helmet",
    rarity: "rare",
    modifiers: [
      { stat: "def", value: 4 },
      { stat: "hp", value: 2 },
    ],
    sprite: createSprite("Mask", RARITY_COLOR_MAP.rare),
    obtainedAt: createTimestamp(300),
    isEquipped: false,
  },
  {
    id: "helmet-hunters-hood",
    name: "Hunter's Hood",
    slot: "helmet",
    rarity: "uncommon",
    modifiers: [
      { stat: "luck", value: 1 },
      { stat: "def", value: 2 },
    ],
    sprite: createSprite("Hood", RARITY_COLOR_MAP.uncommon),
    obtainedAt: createTimestamp(650),
    isEquipped: false,
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
    sprite: createSprite("Armor", RARITY_COLOR_MAP.epic),
    obtainedAt: createTimestamp(90),
    isEquipped: true,
  },
  {
    id: "armor-knights-plate",
    name: "Knight's Plate",
    slot: "armor",
    rarity: "rare",
    modifiers: [{ stat: "def", value: 5 }],
    sprite: createSprite("Plate", RARITY_COLOR_MAP.rare),
    obtainedAt: createTimestamp(410),
    isEquipped: false,
  },
  {
    id: "armor-divine-cloak",
    name: "Divine Cloak",
    slot: "armor",
    rarity: "legendary",
    modifiers: [
      { stat: "def", value: 12 },
      { stat: "atk", value: 1 },
      { stat: "luck", value: 1 },
    ],
    sprite: createSprite("Cloak", RARITY_COLOR_MAP.legendary),
    obtainedAt: createTimestamp(680),
    isEquipped: false,
  },
  {
    id: "armor-chainmail",
    name: "Chainmail",
    slot: "armor",
    rarity: "uncommon",
    modifiers: [
      { stat: "def", value: 3 },
      { stat: "hp", value: 2 },
    ],
    sprite: createSprite("Mail", RARITY_COLOR_MAP.uncommon),
    obtainedAt: createTimestamp(520),
    isEquipped: false,
  },
  {
    id: "armor-leather",
    name: "Leather Armor",
    slot: "armor",
    rarity: "common",
    modifiers: [{ stat: "def", value: 1 }],
    sprite: createSprite("Leather", RARITY_COLOR_MAP.common),
    obtainedAt: createTimestamp(1040),
    isEquipped: false,
  },
  {
    id: "weapon-iron-dagger",
    name: "Steel Sword",
    slot: "weapon",
    rarity: "rare",
    modifiers: [
      { stat: "atk", value: 4 },
      { stat: "luck", value: 1 },
    ],
    sprite: createSprite("Sword", RARITY_COLOR_MAP.rare),
    obtainedAt: createTimestamp(120),
    isEquipped: true,
  },
  {
    id: "weapon-battle-axe",
    name: "Battle Axe",
    slot: "weapon",
    rarity: "epic",
    modifiers: [
      { stat: "atk", value: 6 },
      { stat: "hp", value: -2 },
    ],
    sprite: createSprite("Axe", RARITY_COLOR_MAP.epic),
    obtainedAt: createTimestamp(340),
    isEquipped: false,
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
    sprite: createSprite("Spear", RARITY_COLOR_MAP.legendary),
    obtainedAt: createTimestamp(520),
    isEquipped: false,
  },
  {
    id: "weapon-short-sword",
    name: "Short Sword",
    slot: "weapon",
    rarity: "uncommon",
    modifiers: [{ stat: "atk", value: 3 }],
    sprite: createSprite("Short", RARITY_COLOR_MAP.uncommon),
    obtainedAt: createTimestamp(260),
    isEquipped: false,
  },
  {
    id: "weapon-longbow",
    name: "Longbow",
    slot: "weapon",
    rarity: "rare",
    modifiers: [
      { stat: "atk", value: 5 },
      { stat: "luck", value: 1 },
    ],
    sprite: createSprite("Bow", RARITY_COLOR_MAP.rare),
    obtainedAt: createTimestamp(150),
    isEquipped: false,
  },
  {
    id: "ring-ember",
    name: "Ember Ring",
    slot: "ring",
    rarity: "rare",
    modifiers: [
      { stat: "luck", value: 2 },
      { stat: "atk", value: 1 },
    ],
    sprite: createSprite("Fire", RARITY_COLOR_MAP.rare),
    obtainedAt: createTimestamp(60),
    isEquipped: true,
  },
  {
    id: "ring-silver-band",
    name: "Silver Band",
    slot: "ring",
    rarity: "common",
    modifiers: [{ stat: "luck", value: 1 }],
    sprite: createSprite("Silver", RARITY_COLOR_MAP.common),
    obtainedAt: createTimestamp(480),
    isEquipped: false,
  },
  {
    id: "ring-guardian",
    name: "Guardian Seal",
    slot: "ring",
    rarity: "epic",
    modifiers: [
      { stat: "def", value: 3 },
      { stat: "hp", value: 5 },
    ],
    sprite: createSprite("Guard", RARITY_COLOR_MAP.epic),
    obtainedAt: createTimestamp(310),
    isEquipped: false,
  },
  {
    id: "ring-twilight",
    name: "Twilight Loop",
    slot: "ring",
    rarity: "legendary",
    modifiers: [
      { stat: "luck", value: 3 },
      { stat: "ap", value: 2 },
    ],
    sprite: createSprite("Twilight", RARITY_COLOR_MAP.legendary),
    obtainedAt: createTimestamp(1020),
    isEquipped: false,
  },
  {
    id: "ring-ancient",
    name: "Ancient Token",
    slot: "ring",
    rarity: "uncommon",
    modifiers: [{ stat: "ap", value: 1 }],
    sprite: createSprite("Rune", RARITY_COLOR_MAP.uncommon),
    obtainedAt: createTimestamp(780),
    isEquipped: false,
  },
];

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

    inventoryItems.forEach((item) => {
      if (item.slot === target.slot) {
        item.isEquipped = item.id === target.id;
      }
    });

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

    target.isEquipped = false;

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

    if (removed.isEquipped) {
      setDashboardSlot(removed.slot, null);
    }

    return HttpResponse.json(buildInventoryResponse());
  }),
];

import { http, HttpResponse } from "msw";
import { subMinutes } from "date-fns";
import { INVENTORY_ENDPOINTS } from "@/shared/config/env";
import type {
  InventoryItem,
  InventoryResponse,
} from "@/entities/inventory/model/types";
import { mockDashboardResponse } from "@/mocks/handlers/dashboard-handlers";

function createTimestamp(minutesAgo: number): string {
  return subMinutes(new Date(), minutesAgo).toISOString();
}

const inventoryItems: InventoryItem[] = [
  {
    id: "weapon-iron-dagger",
    name: "Steel Sword",
    slot: "weapon",
    rarity: "rare",
    modifiers: [
      { stat: "atk", value: 4 },
      { stat: "luck", value: 1 },
    ],
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
    obtainedAt: createTimestamp(520),
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
    obtainedAt: createTimestamp(90),
    isEquipped: true,
  },
  {
    id: "armor-knights-plate",
    name: "Knight's Plate",
    slot: "armor",
    rarity: "rare",
    modifiers: [{ stat: "def", value: 5 }],
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
    obtainedAt: createTimestamp(680),
    isEquipped: false,
  },
];

function buildInventoryResponse(): InventoryResponse {
  return {
    items: inventoryItems.map((item) => ({ ...item })),
  };
}

interface EquipItemRequestBody {
  itemId?: string;
}

export const inventoryHandlers = [
  http.get(INVENTORY_ENDPOINTS.list, () => {
    return HttpResponse.json(buildInventoryResponse());
  }),
  http.post(INVENTORY_ENDPOINTS.equip, async ({ request }) => {
    const body = (await request
      .json()
      .catch(() => null)) as EquipItemRequestBody | null;

    if (!body || typeof body.itemId !== "string") {
      return HttpResponse.json(
        { message: "itemId가 필요합니다." },
        { status: 400 }
      );
    }

    const targetItem = inventoryItems.find((item) => item.id === body.itemId);

    if (!targetItem) {
      return HttpResponse.json(
        { message: "존재하지 않는 아이템입니다." },
        { status: 404 }
      );
    }

    inventoryItems.forEach((item) => {
      if (item.slot === targetItem.slot) {
        item.isEquipped = item.id === targetItem.id;
      }
    });

    const equippedItem = {
      id: targetItem.id,
      name: targetItem.name,
      slot: targetItem.slot,
      rarity: targetItem.rarity,
      modifiers: targetItem.modifiers,
    };

    if (targetItem.slot === "weapon") {
      mockDashboardResponse.state.equippedWeapon = equippedItem;
    }

    if (targetItem.slot === "armor") {
      mockDashboardResponse.state.equippedArmor = equippedItem;
    }

    return HttpResponse.json(buildInventoryResponse());
  }),
];

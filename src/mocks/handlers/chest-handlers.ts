import { http } from "msw";
import { CHEST_ENDPOINTS } from "@/shared/config/env";
import { respondWithError, respondWithSuccess } from "@/mocks/lib/api-response";
import type {
  ChestOpenItem,
  ChestOpenResponse,
} from "@/entities/chest/model/types";
import { mockDashboardResponse } from "@/mocks/handlers/dashboard-handlers";

const CHEST_ITEMS: ChestOpenItem[] = [
  {
    itemId: "11111111-1111-4111-8111-111111111111",
    code: "weapon-longsword",
    slot: "weapon",
    rarity: "rare",
    quantity: 1,
  },
  {
    itemId: "22222222-2222-4222-8222-222222222222",
    code: "armor-steel-armor",
    slot: "armor",
    rarity: "uncommon",
    quantity: 1,
  },
  {
    itemId: "33333333-3333-4333-8333-333333333333",
    code: "consumable-health-potion",
    slot: "consumable",
    rarity: "common",
    quantity: 1,
  },
];

const INITIAL_UNOPENED_CHESTS = 2;
const INITIAL_ROLL_INDEX = 0;

let unopenedChests = INITIAL_UNOPENED_CHESTS;
let rollIndex = INITIAL_ROLL_INDEX;

function syncDashboardChests() {
  mockDashboardResponse.state.unopenedChests = unopenedChests;
}

export function resetChestMockState() {
  unopenedChests = INITIAL_UNOPENED_CHESTS;
  rollIndex = INITIAL_ROLL_INDEX;
  syncDashboardChests();
}

function openChest(): ChestOpenResponse {
  const currentRollIndex = rollIndex;
  const item = CHEST_ITEMS[currentRollIndex % CHEST_ITEMS.length];

  unopenedChests = Math.max(0, unopenedChests - 1);
  rollIndex += 1;
  syncDashboardChests();

  return {
    remainingChests: unopenedChests,
    rollIndex: currentRollIndex,
    items: [item],
  };
}

export const chestHandlers = [
  http.post(CHEST_ENDPOINTS.open, () => {
    if (unopenedChests <= 0) {
      return respondWithError("열 수 있는 상자가 없습니다.", {
        status: 409,
        code: "CHEST_EMPTY",
      });
    }

    return respondWithSuccess(openChest());
  }),
];

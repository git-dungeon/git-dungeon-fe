import { http, HttpResponse } from "msw";
import { DASHBOARD_ENDPOINTS } from "@/shared/config/env";
import type { DashboardResponse } from "@/entities/dashboard/model/types";
import { mockTimestampMinutesAgo } from "@/mocks/handlers/shared/time";

export const mockDashboardResponse: DashboardResponse = {
  state: {
    userId: "user-123",
    level: 8,
    exp: 54,
    expToLevel: 80,
    hp: 32,
    maxHp: 40,
    atk: 18,
    def: 14,
    luck: 6,
    floor: 13,
    maxFloor: 15,
    floorProgress: 60,
    gold: 640,
    ap: 18,
    equippedWeapon: {
      id: "weapon-longsword",
      name: "Longsword",
      slot: "weapon",
      rarity: "rare",
      modifiers: [{ stat: "atk", value: 5 }],
    },
    equippedHelmet: {
      id: "helmet-steel-helm",
      name: "Steel Helm",
      slot: "helmet",
      rarity: "uncommon",
      modifiers: [
        { stat: "def", value: 4 },
        { stat: "hp", value: 2 },
      ],
    },
    equippedArmor: {
      id: "armor-steel-armor",
      name: "Steel Armor",
      slot: "armor",
      rarity: "uncommon",
      modifiers: [
        { stat: "def", value: 4 },
        { stat: "luck", value: 1 },
      ],
    },
    equippedRing: {
      id: "ring-topaz",
      name: "Topaz Ring",
      slot: "ring",
      rarity: "uncommon",
      modifiers: [
        { stat: "luck", value: 2 },
        { stat: "hp", value: 2 },
      ],
    },
    currentAction: {
      action: "battle",
      startedAt: mockTimestampMinutesAgo(1),
    },
    lastActionCompletedAt: mockTimestampMinutesAgo(2),
    nextActionStartAt: mockTimestampMinutesAgo(-5),
  },
};
export const dashboardHandlers = [
  http.get(DASHBOARD_ENDPOINTS.state, () => {
    return HttpResponse.json(mockDashboardResponse);
  }),
];

import { http } from "msw";
import { DASHBOARD_ENDPOINTS } from "@/shared/config/env";
import type { DashboardResponse } from "@/entities/dashboard/model/types";
import { mockTimestampMinutesAgo } from "@/mocks/handlers/shared/time";
import { respondWithSuccess } from "@/mocks/lib/api-response";

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
    currentAction: "BATTLE",
    currentActionStartedAt: mockTimestampMinutesAgo(1),
    createdAt: mockTimestampMinutesAgo(90),
    updatedAt: mockTimestampMinutesAgo(1),
    version: 3,
    stats: {
      base: {
        hp: 36,
        atk: 13,
        def: 6,
        luck: 3,
      },
      equipmentBonus: {
        hp: 4,
        atk: 5,
        def: 8,
        luck: 3,
      },
      total: {
        hp: 40,
        atk: 18,
        def: 14,
        luck: 6,
      },
    },
    equippedItems: [
      {
        id: "weapon-longsword",
        code: "weapon-longsword",
        name: "Longsword",
        slot: "weapon",
        rarity: "rare",
        modifiers: [{ kind: "stat", stat: "atk", mode: "flat", value: 5 }],
        effect: null,
        sprite: null,
        createdAt: mockTimestampMinutesAgo(80),
        isEquipped: true,
        version: 3,
      },
      {
        id: "helmet-steel-helm",
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
        createdAt: mockTimestampMinutesAgo(70),
        isEquipped: true,
        version: 3,
      },
      {
        id: "armor-steel-armor",
        code: "armor-steel-armor",
        name: "Steel Armor",
        slot: "armor",
        rarity: "uncommon",
        modifiers: [
          { kind: "stat", stat: "def", mode: "flat", value: 4 },
          { kind: "stat", stat: "luck", mode: "flat", value: 1 },
        ],
        effect: null,
        sprite: null,
        createdAt: mockTimestampMinutesAgo(60),
        isEquipped: true,
        version: 3,
      },
      {
        id: "ring-topaz",
        code: "ring-topaz",
        name: "Topaz Ring",
        slot: "ring",
        rarity: "uncommon",
        modifiers: [
          { kind: "stat", stat: "luck", mode: "flat", value: 2 },
          { kind: "stat", stat: "hp", mode: "flat", value: 2 },
        ],
        effect: null,
        sprite: null,
        createdAt: mockTimestampMinutesAgo(50),
        isEquipped: true,
        version: 3,
      },
    ],
    lastActionCompletedAt: mockTimestampMinutesAgo(2),
    nextActionStartAt: mockTimestampMinutesAgo(-5),
  },
};
export const dashboardHandlers = [
  http.get(DASHBOARD_ENDPOINTS.state, () => {
    return respondWithSuccess(mockDashboardResponse);
  }),
];

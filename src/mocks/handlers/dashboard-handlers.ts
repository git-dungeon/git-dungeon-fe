import { http, HttpResponse } from "msw";
import { subMinutes } from "date-fns";
import { DASHBOARD_ENDPOINTS } from "@/shared/config/env";
import type { DashboardResponse } from "@/entities/dashboard/model/types";
import type { DungeonLogEntry } from "@/entities/dungeon-log/model/types";

function createTimestamp(minutesAgo: number): string {
  return subMinutes(new Date(), minutesAgo).toISOString();
}

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
      startedAt: createTimestamp(1),
    },
    lastActionCompletedAt: createTimestamp(2),
    nextActionStartAt: createTimestamp(0),
  },
};

export const mockDungeonLogs: DungeonLogEntry[] = [
  {
    id: "log-001",
    floor: 13,
    action: "battle",
    status: "started",
    timestamp: createTimestamp(1),
    delta: {
      ap: -1,
    },
  },
  {
    id: "log-002",
    floor: 13,
    action: "empty",
    status: "completed",
    timestamp: createTimestamp(2),
    delta: {
      ap: 0,
      progress: 10,
    },
  },
  {
    id: "log-003",
    floor: 13,
    action: "empty",
    status: "started",
    timestamp: createTimestamp(3),
    delta: {
      ap: -1,
    },
  },
  {
    id: "log-004",
    floor: 13,
    action: "treasure",
    status: "completed",
    timestamp: createTimestamp(5),
    delta: {
      ap: 0,
      gold: 45,
      item: "Iron Shield",
      progress: 10,
    },
  },
  {
    id: "log-005",
    floor: 13,
    action: "treasure",
    status: "started",
    timestamp: createTimestamp(6),
    delta: {
      ap: -1,
    },
  },
  {
    id: "log-006",
    floor: 13,
    action: "battle",
    status: "completed",
    timestamp: createTimestamp(8),
    delta: {
      ap: 0,
      hp: -3,
      exp: 14,
      gold: 30,
      progress: 20,
    },
  },
  {
    id: "log-007",
    floor: 13,
    action: "battle",
    status: "started",
    timestamp: createTimestamp(9),
    delta: {
      ap: -1,
    },
  },
  {
    id: "log-008",
    floor: 13,
    action: "trap",
    status: "completed",
    timestamp: createTimestamp(12),
    delta: {
      ap: 0,
      hp: -4,
      gold: -10,
      progress: 10,
    },
  },
  {
    id: "log-009",
    floor: 13,
    action: "trap",
    status: "started",
    timestamp: createTimestamp(13),
    delta: {
      ap: -1,
    },
  },
  {
    id: "log-010",
    floor: 13,
    action: "rest",
    status: "completed",
    timestamp: createTimestamp(16),
    delta: {
      ap: 0,
      hp: 6,
      progress: 10,
    },
  },
  {
    id: "log-011",
    floor: 13,
    action: "rest",
    status: "started",
    timestamp: createTimestamp(17),
    delta: {
      ap: -1,
    },
  },
  {
    id: "log-012",
    floor: 13,
    action: "move",
    status: "completed",
    timestamp: createTimestamp(20),
    delta: {
      ap: 0,
      progress: -100,
    },
  },
  {
    id: "log-013",
    floor: 12,
    action: "move",
    status: "started",
    timestamp: createTimestamp(21),
    delta: {
      ap: -1,
    },
  },
  {
    id: "log-014",
    floor: 12,
    action: "battle",
    status: "completed",
    timestamp: createTimestamp(25),
    delta: {
      ap: 0,
      hp: -2,
      exp: 12,
      gold: 18,
      progress: 20,
    },
  },
];

export const dashboardHandlers = [
  http.get(DASHBOARD_ENDPOINTS.state, () => {
    return HttpResponse.json(mockDashboardResponse);
  }),
  http.get(DASHBOARD_ENDPOINTS.logs, ({ request }) => {
    const url = new URL(request.url);
    const limitParam = url.searchParams.get("limit");
    const cursor = url.searchParams.get("cursor");

    const limit = limitParam ? Number.parseInt(limitParam, 10) : 10;
    const resolvedLimit =
      Number.isFinite(limit) && limit !== 0 ? Math.abs(limit) : 10;

    const startIndex = cursor
      ? Math.max(mockDungeonLogs.findIndex((log) => log.id === cursor) + 1, 0)
      : 0;

    const logs = mockDungeonLogs.slice(startIndex, startIndex + resolvedLimit);
    const lastItem = logs.at(-1);
    const hasMore = startIndex + resolvedLimit < mockDungeonLogs.length;

    return HttpResponse.json({
      logs,
      nextCursor: hasMore && lastItem ? lastItem.id : undefined,
    });
  }),
];

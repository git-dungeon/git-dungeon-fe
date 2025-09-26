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
    category: "exploration",
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
    category: "exploration",
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
    category: "exploration",
    floor: 13,
    action: "empty",
    status: "started",
    timestamp: createTimestamp(3),
    delta: {
      ap: -1,
    },
  },
  {
    id: "log-015",
    category: "status",
    floor: 13,
    action: "equip",
    status: "completed",
    timestamp: createTimestamp(4),
    delta: {
      ap: 0,
      item: "Steel Helm",
      slot: "helmet",
    },
  },
  {
    id: "log-004",
    category: "exploration",
    floor: 13,
    action: "treasure",
    status: "completed",
    timestamp: createTimestamp(5),
    delta: {
      ap: 0,
      gold: 45,
      item: "Copper Band",
      progress: 10,
    },
  },
  {
    id: "log-005",
    category: "exploration",
    floor: 13,
    action: "treasure",
    status: "started",
    timestamp: createTimestamp(6),
    delta: {
      ap: -1,
    },
  },
  {
    id: "log-016",
    category: "status",
    floor: 13,
    action: "unequip",
    status: "completed",
    timestamp: createTimestamp(7),
    delta: {
      ap: 0,
      item: "Bronze Helm",
      slot: "helmet",
    },
  },
  {
    id: "log-006",
    category: "exploration",
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
    category: "exploration",
    floor: 13,
    action: "battle",
    status: "started",
    timestamp: createTimestamp(9),
    delta: {
      ap: -1,
    },
  },
  {
    id: "log-017",
    category: "status",
    floor: 13,
    action: "equip",
    status: "completed",
    timestamp: createTimestamp(10),
    delta: {
      ap: 0,
      item: "Knight's Helm",
      slot: "helmet",
    },
  },
  {
    id: "log-018",
    category: "status",
    floor: 13,
    action: "discard",
    status: "completed",
    timestamp: createTimestamp(11),
    delta: {
      ap: 0,
      item: "Leather Cap",
      slot: "helmet",
    },
  },
  {
    id: "log-008",
    category: "exploration",
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
    category: "exploration",
    floor: 13,
    action: "trap",
    status: "started",
    timestamp: createTimestamp(13),
    delta: {
      ap: -1,
    },
  },
  {
    id: "log-019",
    category: "status",
    floor: 13,
    action: "equip",
    status: "completed",
    timestamp: createTimestamp(14),
    delta: {
      ap: 0,
      item: "Topaz Ring",
      slot: "ring",
    },
  },
  {
    id: "log-020",
    category: "status",
    floor: 13,
    action: "unequip",
    status: "completed",
    timestamp: createTimestamp(15),
    delta: {
      ap: 0,
      item: "Bronze Ring",
      slot: "ring",
    },
  },
  {
    id: "log-010",
    category: "exploration",
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
    category: "exploration",
    floor: 13,
    action: "rest",
    status: "started",
    timestamp: createTimestamp(17),
    delta: {
      ap: -1,
    },
  },
  {
    id: "log-021",
    category: "status",
    floor: 13,
    action: "discard",
    status: "completed",
    timestamp: createTimestamp(18),
    delta: {
      ap: 0,
      item: "Rusty Sword",
      slot: "weapon",
    },
  },
  {
    id: "log-022",
    category: "status",
    floor: 13,
    action: "equip",
    status: "completed",
    timestamp: createTimestamp(19),
    delta: {
      ap: 0,
      item: "Longsword",
      slot: "weapon",
    },
  },
  {
    id: "log-012",
    category: "exploration",
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
    category: "exploration",
    floor: 12,
    action: "move",
    status: "started",
    timestamp: createTimestamp(21),
    delta: {
      ap: -1,
    },
  },
  {
    id: "log-023",
    category: "status",
    floor: 12,
    action: "equip",
    status: "completed",
    timestamp: createTimestamp(22),
    delta: {
      ap: 0,
      item: "Steel Armor",
      slot: "armor",
    },
  },
  {
    id: "log-024",
    category: "status",
    floor: 12,
    action: "discard",
    status: "completed",
    timestamp: createTimestamp(23),
    delta: {
      ap: 0,
      item: "Leather Armor",
      slot: "armor",
    },
  },
  {
    id: "log-014",
    category: "exploration",
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
    const typeParam = url.searchParams.get("type");

    const limit = limitParam ? Number.parseInt(limitParam, 10) : 10;
    const resolvedLimit =
      Number.isFinite(limit) && limit !== 0 ? Math.abs(limit) : 10;

    const normalizedType =
      typeParam === "exploration" || typeParam === "status"
        ? typeParam
        : undefined;

    const sourceLogs = normalizedType
      ? mockDungeonLogs.filter((log) => log.category === normalizedType)
      : mockDungeonLogs;

    const cursorIndex = cursor
      ? sourceLogs.findIndex((log) => log.id === cursor)
      : -1;
    const startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;

    const logs = sourceLogs.slice(startIndex, startIndex + resolvedLimit);
    const lastItem = logs.at(-1);
    const hasMore = startIndex + resolvedLimit < sourceLogs.length;

    return HttpResponse.json({
      logs,
      nextCursor: hasMore && lastItem ? lastItem.id : undefined,
    });
  }),
];

import { http } from "msw";
import { DASHBOARD_ENDPOINTS } from "@/shared/config/env";
import type { DungeonLogEntry } from "@/entities/dungeon-log/model/types";
import { mockTimestampMinutesAgo } from "@/mocks/handlers/shared/time";
import giantRatImage from "@/assets/Giant Rat.png";
import { respondWithSuccess } from "@/mocks/lib/api-response";

export const mockDungeonLogs: DungeonLogEntry[] = [
  {
    id: "log-001",
    category: "exploration",
    floor: 13,
    action: "battle",
    status: "started",
    createdAt: mockTimestampMinutesAgo(1),
    delta: {
      ap: -1,
    },
    details: {
      type: "battle",
      monster: {
        id: "monster-giant-rat",
        name: "거대 쥐",
        hp: 24,
        atk: 3,
        sprite: giantRatImage,
      },
    },
  },
  {
    id: "log-002",
    category: "exploration",
    floor: 13,
    action: "empty",
    status: "completed",
    createdAt: mockTimestampMinutesAgo(2),
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
    createdAt: mockTimestampMinutesAgo(3),
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
    createdAt: mockTimestampMinutesAgo(4),
    delta: {
      ap: 0,
      item: "Steel Helm",
      slot: "helmet",
      stats: {
        def: 4,
        hp: 2,
      },
    },
  },
  {
    id: "log-004",
    category: "exploration",
    floor: 13,
    action: "treasure",
    status: "completed",
    createdAt: mockTimestampMinutesAgo(5),
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
    createdAt: mockTimestampMinutesAgo(6),
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
    createdAt: mockTimestampMinutesAgo(7),
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
    createdAt: mockTimestampMinutesAgo(8),
    delta: {
      ap: 0,
      hp: -3,
      exp: 14,
      gold: 30,
      progress: 20,
    },
    details: {
      type: "battle",
      monster: {
        id: "monster-giant-rat",
        name: "거대 쥐",
        hp: 24,
        atk: 3,
        sprite: giantRatImage,
      },
    },
  },
  {
    id: "log-007",
    category: "exploration",
    floor: 13,
    action: "battle",
    status: "started",
    createdAt: mockTimestampMinutesAgo(9),
    delta: {
      ap: -1,
    },
    details: {
      type: "battle",
      monster: {
        id: "monster-giant-rat",
        name: "거대 쥐",
        hp: 24,
        atk: 3,
        sprite: giantRatImage,
      },
    },
  },
  {
    id: "log-017",
    category: "status",
    floor: 13,
    action: "equip",
    status: "completed",
    createdAt: mockTimestampMinutesAgo(10),
    delta: {
      ap: 0,
      item: "Knight's Helm",
      slot: "helmet",
      stats: {
        def: 6,
        hp: 4,
      },
    },
  },
  {
    id: "log-018",
    category: "status",
    floor: 13,
    action: "discard",
    status: "completed",
    createdAt: mockTimestampMinutesAgo(11),
    delta: {
      ap: 0,
      item: "Leather Cap",
      slot: "helmet",
      stats: {
        def: -1,
      },
    },
  },
  {
    id: "log-008",
    category: "exploration",
    floor: 13,
    action: "trap",
    status: "completed",
    createdAt: mockTimestampMinutesAgo(12),
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
    createdAt: mockTimestampMinutesAgo(13),
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
    createdAt: mockTimestampMinutesAgo(14),
    delta: {
      ap: 0,
      item: "Topaz Ring",
      slot: "ring",
      stats: {
        luck: 2,
        hp: 2,
      },
    },
  },
  {
    id: "log-020",
    category: "status",
    floor: 13,
    action: "unequip",
    status: "completed",
    createdAt: mockTimestampMinutesAgo(15),
    delta: {
      ap: 0,
      item: "Bronze Ring",
      slot: "ring",
      stats: {
        luck: -1,
      },
    },
  },
  {
    id: "log-010",
    category: "exploration",
    floor: 13,
    action: "rest",
    status: "completed",
    createdAt: mockTimestampMinutesAgo(16),
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
    createdAt: mockTimestampMinutesAgo(17),
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
    createdAt: mockTimestampMinutesAgo(18),
    delta: {
      ap: 0,
      item: "Rusty Sword",
      slot: "weapon",
      stats: {
        atk: -2,
      },
    },
  },
  {
    id: "log-022",
    category: "status",
    floor: 13,
    action: "equip",
    status: "completed",
    createdAt: mockTimestampMinutesAgo(19),
    delta: {
      ap: 0,
      item: "Longsword",
      slot: "weapon",
      stats: {
        atk: 5,
      },
    },
  },
  {
    id: "log-012",
    category: "exploration",
    floor: 13,
    action: "move",
    status: "completed",
    createdAt: mockTimestampMinutesAgo(20),
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
    createdAt: mockTimestampMinutesAgo(21),
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
    createdAt: mockTimestampMinutesAgo(22),
    delta: {
      ap: 0,
      item: "Steel Armor",
      slot: "armor",
      stats: {
        def: 4,
        luck: 1,
      },
    },
  },
  {
    id: "log-024",
    category: "status",
    floor: 12,
    action: "discard",
    status: "completed",
    createdAt: mockTimestampMinutesAgo(23),
    delta: {
      ap: 0,
      item: "Leather Armor",
      slot: "armor",
      stats: {
        def: -1,
      },
    },
  },
  {
    id: "log-014",
    category: "exploration",
    floor: 12,
    action: "battle",
    status: "completed",
    createdAt: mockTimestampMinutesAgo(25),
    delta: {
      ap: 0,
      hp: -2,
      exp: 12,
      gold: 18,
      progress: 20,
    },
    details: {
      type: "battle",
      monster: {
        id: "monster-giant-rat",
        name: "거대 쥐",
        hp: 24,
        atk: 3,
        sprite: giantRatImage,
      },
    },
  },
];

export const dungeonLogHandlers = [
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

    return respondWithSuccess({
      logs,
      nextCursor: hasMore && lastItem ? lastItem.id : undefined,
    });
  }),
];

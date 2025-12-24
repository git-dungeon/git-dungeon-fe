import { http } from "msw";
import { DASHBOARD_ENDPOINTS } from "@/shared/config/env";
import type {
  DungeonLogEntry,
  DungeonLogsFilterType,
} from "@/entities/dungeon-log/model/types";
import { DUNGEON_LOGS_FILTER_TYPES } from "@/entities/dungeon-log/model/types";
import { mockTimestampMinutesAgo } from "@/mocks/handlers/shared/time";
import { respondWithError, respondWithSuccess } from "@/mocks/lib/api-response";

function base64UrlEncode(value: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "utf-8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  }

  if (typeof btoa !== "undefined") {
    return btoa(value)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  }

  return value;
}

function base64UrlDecode(value: string): string | null {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding =
    normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  const base64 = normalized + padding;

  try {
    if (typeof Buffer !== "undefined") {
      return Buffer.from(base64, "base64").toString("utf-8");
    }
    if (typeof atob !== "undefined") {
      return atob(base64);
    }
  } catch {
    return null;
  }

  return null;
}

function encodeCursor(sequence: number): string {
  return base64UrlEncode(String(sequence));
}

function decodeCursor(cursor: string): number | null {
  const decoded = base64UrlDecode(cursor);
  if (!decoded) {
    return null;
  }

  const parsed = Number.parseInt(decoded, 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

const mockDungeonLogs: DungeonLogEntry[] = [
  {
    id: "log-001",
    category: "EXPLORATION",
    floor: 13,
    action: "BATTLE",
    status: "STARTED",
    createdAt: mockTimestampMinutesAgo(1),
    delta: {
      type: "BATTLE",
      detail: {
        stats: { ap: -1 },
        rewards: {
          gold: 12,
          items: [
            {
              code: "ring-copper-band",
              quantity: 1,
            },
          ],
        },
      },
    },
    extra: {
      type: "BATTLE",
      details: {
        monster: {
          code: "monster-giant-rat",
          name: "거대 쥐",
          hp: 24,
          atk: 3,
          def: 1,
          spriteId: "sprite/monster-giant-rat",
        },
        player: {
          hp: 32,
          maxHp: 40,
          atk: 18,
          def: 14,
          luck: 6,
          stats: {
            base: { hp: 36, atk: 13, def: 6, luck: 3 },
            equipmentBonus: { hp: 4, atk: 5, def: 8, luck: 3 },
            total: { hp: 40, atk: 18, def: 14, luck: 6 },
          },
          level: 8,
          exp: 54,
          expToLevel: 80,
        },
        result: "VICTORY",
      },
    },
  },
  {
    id: "log-002",
    category: "STATUS",
    floor: null,
    action: "EQUIP_ITEM",
    status: "COMPLETED",
    createdAt: mockTimestampMinutesAgo(2),
    stateVersionBefore: 12,
    stateVersionAfter: 13,
    delta: {
      type: "EQUIP_ITEM",
      detail: {
        inventory: {
          equipped: {
            itemId: "inv-002",
            code: "helmet-steel-helm",
            slot: "helmet",
            rarity: "rare",
          },
          unequipped: {
            itemId: "inv-001",
            code: "helmet-bronze-helm",
            slot: "helmet",
            rarity: "common",
          },
        },
        stats: { def: 4, hp: 2 },
      },
    },
    extra: {
      type: "EQUIP_ITEM",
      details: {
        item: {
          id: "helmet-steel-helm",
          code: "helmet-steel-helm",
          name: "Steel Helm",
          rarity: "rare",
          modifiers: [{ kind: "stat", stat: "def", mode: "flat", value: 4 }],
        },
      },
    },
  },
  {
    id: "log-003",
    category: "EXPLORATION",
    floor: 13,
    action: "TREASURE",
    status: "COMPLETED",
    createdAt: mockTimestampMinutesAgo(3),
    delta: {
      type: "TREASURE",
      detail: {
        progress: { delta: 10 },
        rewards: {
          gold: 45,
          items: [
            {
              code: "ring-copper-band",
              quantity: 1,
            },
          ],
        },
      },
    },
    extra: {
      type: "TREASURE",
      details: {
        rewardCode: "treasure-basic",
        rarity: "common",
      },
    },
  },
  {
    id: "log-004",
    category: "EXPLORATION",
    floor: 13,
    action: "REST",
    status: "COMPLETED",
    createdAt: mockTimestampMinutesAgo(4),
    delta: {
      type: "REST",
      detail: {
        stats: { hp: 5, ap: -1 },
        progress: { delta: 5 },
      },
    },
    extra: {
      type: "REST",
      details: { source: "campfire" },
    },
  },
  {
    id: "log-005",
    category: "EXPLORATION",
    floor: 13,
    action: "TRAP",
    status: "COMPLETED",
    createdAt: mockTimestampMinutesAgo(5),
    delta: {
      type: "TRAP",
      detail: {
        stats: { hp: -3, ap: -1 },
        progress: { delta: 5 },
      },
    },
    extra: {
      type: "TRAP",
      details: { trapCode: "spike" },
    },
  },
  {
    id: "log-006",
    category: "EXPLORATION",
    floor: 13,
    action: "MOVE",
    status: "COMPLETED",
    createdAt: mockTimestampMinutesAgo(6),
    delta: {
      type: "MOVE",
      detail: {
        fromFloor: 12,
        toFloor: 13,
        previousProgress: 80,
        progress: {
          floor: 13,
          floorProgress: 0,
          previousProgress: 80,
          delta: 20,
        },
      },
    },
    extra: {
      type: "MOVE",
      details: { rewards: { gold: 10 } },
    },
  },
  {
    id: "log-007",
    category: "STATUS",
    floor: null,
    action: "ACQUIRE_ITEM",
    status: "COMPLETED",
    createdAt: mockTimestampMinutesAgo(7),
    delta: {
      type: "ACQUIRE_ITEM",
      detail: {
        inventory: {
          added: [
            {
              itemId: "inv-004",
              code: "weapon-wooden-sword",
              slot: "weapon",
              quantity: 1,
            },
          ],
        },
      },
    },
    extra: {
      type: "ACQUIRE_ITEM",
      details: {
        reward: {
          source: "TREASURE",
          drop: {
            tableId: "drops-default",
            isElite: false,
            items: [{ code: "weapon-wooden-sword", quantity: 1 }],
          },
        },
      },
    },
  },
  {
    id: "log-008",
    category: "STATUS",
    floor: null,
    action: "UNEQUIP_ITEM",
    status: "COMPLETED",
    createdAt: mockTimestampMinutesAgo(8),
    delta: {
      type: "UNEQUIP_ITEM",
      detail: {
        inventory: {
          unequipped: {
            itemId: "inv-002",
            code: "helmet-steel-helm",
            slot: "helmet",
          },
        },
      },
    },
  },
  {
    id: "log-009",
    category: "STATUS",
    floor: null,
    action: "DISCARD_ITEM",
    status: "COMPLETED",
    createdAt: mockTimestampMinutesAgo(9),
    delta: {
      type: "DISCARD_ITEM",
      detail: {
        inventory: {
          removed: [
            {
              itemId: "inv-003",
              code: "ring-copper-band",
              slot: "ring",
              quantity: 1,
            },
          ],
        },
      },
    },
  },
  {
    id: "log-010",
    category: "STATUS",
    floor: null,
    action: "BUFF_APPLIED",
    status: "COMPLETED",
    createdAt: mockTimestampMinutesAgo(10),
    delta: {
      type: "BUFF_APPLIED",
      detail: {
        applied: [
          {
            buffId: "buff-regen",
            source: "REST",
            totalTurns: 3,
            remainingTurns: 3,
          },
        ],
      },
    },
    extra: {
      type: "BUFF_APPLIED",
      details: {
        buffId: "buff-regen",
        source: "REST",
        spriteId: "buff_regen",
        effect: "HP regen",
        totalTurns: 3,
        remainingTurns: 3,
      },
    },
  },
  {
    id: "log-011",
    category: "STATUS",
    floor: null,
    action: "BUFF_EXPIRED",
    status: "COMPLETED",
    createdAt: mockTimestampMinutesAgo(11),
    delta: {
      type: "BUFF_EXPIRED",
      detail: {
        expired: [
          { buffId: "buff-regen", expiredAtTurn: 18, consumedBy: "TURN" },
        ],
      },
    },
    extra: {
      type: "BUFF_EXPIRED",
      details: {
        buffId: "buff-regen",
        expiredAtTurn: 18,
        consumedBy: "TURN",
      },
    },
  },
  {
    id: "log-012",
    category: "STATUS",
    floor: null,
    action: "LEVEL_UP",
    status: "COMPLETED",
    createdAt: mockTimestampMinutesAgo(12),
    delta: {
      type: "LEVEL_UP",
      detail: {
        stats: { level: 1, hp: 5, atk: 1 },
        rewards: { skillPoints: 1 },
      },
    },
    extra: {
      type: "LEVEL_UP",
      details: {
        previousLevel: 3,
        currentLevel: 4,
        threshold: 100,
        statsGained: { hp: 5, atk: 1 },
      },
    },
  },
  {
    id: "log-013",
    category: "EXPLORATION",
    floor: 13,
    action: "DEATH",
    status: "COMPLETED",
    createdAt: mockTimestampMinutesAgo(13),
    delta: {
      type: "DEATH",
      detail: {
        stats: { hp: -999, ap: 0 },
        progress: { floor: 13, floorProgress: 0, delta: 0 },
        buffs: [{ buffId: "buff-regen", source: "REST" }],
      },
    },
    extra: {
      type: "DEATH",
      details: { cause: "BATTLE", handledBy: "respawn" },
    },
  },
  {
    id: "log-014",
    category: "EXPLORATION",
    floor: 13,
    action: "REVIVE",
    status: "COMPLETED",
    createdAt: mockTimestampMinutesAgo(14),
    delta: {
      type: "REVIVE",
      detail: {
        stats: { hp: 5, ap: 0 },
      },
    },
    extra: null,
  },
];

function isValidFilterType(type: string | null): type is DungeonLogsFilterType {
  return Boolean(
    type && (DUNGEON_LOGS_FILTER_TYPES as readonly string[]).includes(type)
  );
}

function filterLogs(
  logs: DungeonLogEntry[],
  filterType?: DungeonLogsFilterType
): DungeonLogEntry[] {
  if (!filterType) {
    return logs;
  }
  if (filterType === "EXPLORATION" || filterType === "STATUS") {
    return logs.filter((log) => log.category === filterType);
  }
  return logs.filter((log) => log.action === filterType);
}

function resolveLimit(raw: string | null): number | null {
  if (raw == null) {
    return 10;
  }
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  if (parsed < 1 || parsed > 50) {
    return null;
  }
  return parsed;
}

export const dungeonLogHandlers = [
  http.get(DASHBOARD_ENDPOINTS.logs, ({ request }) => {
    const url = new URL(request.url);

    const limit = resolveLimit(url.searchParams.get("limit"));
    if (limit == null) {
      return respondWithError("잘못된 로그 조회 요청입니다.", {
        status: 400,
        code: "LOGS_INVALID_QUERY",
      });
    }

    const typeParam = url.searchParams.get("type");
    const filterType = typeParam
      ? isValidFilterType(typeParam)
        ? typeParam
        : null
      : undefined;
    if (filterType === null) {
      return respondWithError("잘못된 로그 조회 요청입니다.", {
        status: 400,
        code: "LOGS_INVALID_QUERY",
      });
    }

    const cursorParam = url.searchParams.get("cursor");

    const sourceLogs = filterLogs(mockDungeonLogs, filterType);

    const cursor = cursorParam ? decodeCursor(cursorParam) : null;
    if (cursorParam && cursor === null) {
      return respondWithError("잘못된 로그 조회 요청입니다.", {
        status: 400,
        code: "LOGS_INVALID_QUERY",
      });
    }

    if (typeof cursor === "number" && cursor >= sourceLogs.length) {
      return respondWithError("잘못된 로그 조회 요청입니다.", {
        status: 400,
        code: "LOGS_INVALID_QUERY",
      });
    }

    const startIndex = typeof cursor === "number" ? cursor + 1 : 0;
    const page = sourceLogs.slice(startIndex, startIndex + limit);
    const hasMore = startIndex + limit < sourceLogs.length;
    const nextSequence = startIndex + page.length - 1;

    return respondWithSuccess({
      logs: page,
      nextCursor: hasMore ? encodeCursor(nextSequence) : null,
    });
  }),
];

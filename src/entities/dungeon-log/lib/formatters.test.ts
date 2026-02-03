import { describe, expect, it } from "vitest";
import type { DungeonLogEntry } from "@/entities/dungeon-log/model/types";
import { buildLogDescription, formatDelta } from "./formatters";

describe("formatDelta", () => {
  it("BATTLE 보상 아이템이 있으면 아이템 N개 요약을 추가한다", () => {
    const entry: DungeonLogEntry = {
      id: "log-battle-reward",
      category: "EXPLORATION",
      floor: 1,
      action: "BATTLE",
      status: "COMPLETED",
      createdAt: "2025-12-01T00:00:00Z",
      delta: {
        type: "BATTLE",
        detail: {
          rewards: {
            items: [
              { code: "ring-copper-band", quantity: 2 },
              { code: "weapon-wooden-sword", quantity: 1 },
            ],
          },
        },
      },
      extra: null,
    };

    const entries = formatDelta(entry);
    const summary = entries.find((item) => item.text === "아이템 3개");

    expect(summary).toBeDefined();
    expect(summary?.tone).toBe("success");
  });

  it("BATTLE 보상에 상자가 있으면 상자 수량을 표시한다", () => {
    const entry: DungeonLogEntry = {
      id: "log-battle-chests",
      category: "EXPLORATION",
      floor: 1,
      action: "BATTLE",
      status: "COMPLETED",
      createdAt: "2025-12-01T00:00:00Z",
      delta: {
        type: "BATTLE",
        detail: {
          rewards: {
            chests: 2,
          },
        },
      },
      extra: null,
    };

    const entries = formatDelta(entry);
    const chestDelta = entries.find((item) => item.text === "상자 +2");

    expect(chestDelta).toBeDefined();
    expect(chestDelta?.tone).toBe("success");
  });

  it("DISMANTLE_ITEM 로그에서 제거/획득 변동을 함께 표시한다", () => {
    const entry: DungeonLogEntry = {
      id: "log-dismantle-delta",
      category: "STATUS",
      floor: null,
      action: "DISMANTLE_ITEM",
      status: "COMPLETED",
      createdAt: "2025-12-01T00:00:00Z",
      delta: {
        type: "DISMANTLE_ITEM",
        detail: {
          inventory: {
            added: [
              {
                itemId: "inv-material-1",
                code: "material-metal-scrap",
                slot: "material",
                quantity: 3,
              },
            ],
            removed: [
              {
                itemId: "inv-weapon-1",
                code: "weapon-wooden-sword",
                slot: "weapon",
                quantity: 1,
              },
            ],
          },
        },
      },
      extra: null,
    };

    const entries = formatDelta(entry);
    const acquired = entries.find(
      (item) => item.text === "획득 material-metal-scrap x3"
    );
    const removed = entries.find(
      (item) => item.text === "제거 weapon-wooden-sword x1"
    );

    expect(acquired).toBeDefined();
    expect(acquired?.tone).toBe("success");
    expect(acquired?.icon).toBe("plus");
    expect(removed).toBeDefined();
    expect(removed?.tone).toBe("danger");
    expect(removed?.icon).toBe("minus");
  });

  it("ENHANCE_ITEM 로그에서 성공/확률 문구를 표시한다", () => {
    const entry: DungeonLogEntry = {
      id: "log-enhance-delta",
      category: "STATUS",
      floor: null,
      action: "ENHANCE_ITEM",
      status: "COMPLETED",
      createdAt: "2026-02-03T00:00:00Z",
      delta: {
        type: "ENHANCE_ITEM",
        detail: {
          inventory: {
            removed: [
              {
                itemId: "inv-material-1",
                code: "material-metal-scrap",
                slot: "material",
                quantity: 2,
              },
            ],
          },
          stats: { atk: 1 },
        },
      },
      extra: {
        type: "ENHANCE_ITEM",
        details: {
          item: {
            id: "inv-weapon-1",
            code: "weapon-wooden-sword",
            rarity: "epic",
            modifiers: [],
            name: "Wooden Sword",
          },
          enhancement: {
            before: 1,
            after: 2,
            success: true,
            chance: 0.8,
          },
          cost: {
            gold: 10,
            materials: [{ code: "material-metal-scrap", quantity: 2 }],
          },
        },
      },
    };

    const entries = formatDelta(entry);
    expect(entries.some((item) => item.text === "강화 성공 (★1 → ★2)")).toBe(
      true
    );
  });

  it("MOVE 로그에서 층 증가와 진행도 변화를 함께 표시한다", () => {
    const entry: DungeonLogEntry = {
      id: "log-move-complete",
      category: "EXPLORATION",
      floor: 2,
      action: "MOVE",
      status: "COMPLETED",
      createdAt: "2025-12-01T00:00:00Z",
      delta: {
        type: "MOVE",
        detail: {
          fromFloor: 1,
          toFloor: 2,
          previousProgress: 80,
          progress: {
            floor: 2,
            floorProgress: 0,
            previousProgress: 80,
            delta: 20,
          },
        },
      },
      extra: null,
    };

    const entries = formatDelta(entry);
    const floorDelta = entries.find((item) => item.text === "층 +1");
    const floorProgress = entries.find(
      (item) => item.text === "층 진행도 +20%"
    );

    expect(floorDelta).toBeDefined();
    expect(floorDelta?.tone).toBe("success");
    expect(floorProgress).toBeDefined();
    expect(floorProgress?.tone).toBe("success");
  });

  it("BATTLE 완료 시 전투 결과 문구를 우선 적용한다", () => {
    const entry = {
      id: "log-battle-victory",
      category: "EXPLORATION",
      action: "BATTLE",
      status: "COMPLETED",
      createdAt: "2025-12-01T00:00:00Z",
      extra: {
        type: "BATTLE",
        details: {
          result: "VICTORY",
        },
      },
      delta: null,
    } as DungeonLogEntry;

    const message = buildLogDescription(entry);

    expect(message).toContain("전투에서 승리했습니다");
  });

  it("DEATH 로그에 사망 원인 문구를 포함한다", () => {
    const entry = {
      id: "log-death-cause",
      category: "STATUS",
      action: "DEATH",
      status: "COMPLETED",
      createdAt: "2025-12-01T00:00:00Z",
      extra: {
        type: "DEATH",
        details: {
          cause: "독",
        },
      },
      delta: null,
    } as DungeonLogEntry;

    const message = buildLogDescription(entry);

    expect(message).toContain("사망 원인: 독");
  });

  it("DEATH 원인 코드가 라벨로 변환된다", () => {
    const entry = {
      id: "log-death-player-defeated",
      category: "STATUS",
      action: "DEATH",
      status: "COMPLETED",
      createdAt: "2025-12-01T00:00:00Z",
      extra: {
        type: "DEATH",
        details: {
          cause: "PLAYER_DEFEATED",
        },
      },
      delta: null,
    } as DungeonLogEntry;

    const message = buildLogDescription(entry);

    expect(message).toContain("사망 원인: 전투에서 패배");
  });

  it("DEATH 로그에 사망 원인과 처리자를 함께 표시한다", () => {
    const entry = {
      id: "log-death-handled",
      category: "STATUS",
      action: "DEATH",
      status: "COMPLETED",
      createdAt: "2025-12-01T00:00:00Z",
      extra: {
        type: "DEATH",
        details: {
          cause: "PLAYER_DEFEATED",
          handledBy: "monster-giant-rat",
        },
      },
      delta: null,
    } as DungeonLogEntry;

    const message = buildLogDescription(entry, {
      resolveMonsterName: (code, fallback) =>
        code === "monster-giant-rat" ? "거대 쥐" : (fallback ?? code),
    });

    expect(message).toContain("사망 원인: 전투에서 패배 (거대 쥐)");
  });

  it.each([
    { success: true, expected: "강화가 성공했습니다" },
    { success: false, expected: "강화에 실패했습니다" },
  ])(
    "ENHANCE_ITEM 로그는 성공 여부에 따라 상태 문구가 달라진다",
    ({ success, expected }) => {
      const entry = {
        id: `log-enhance-status-${success ? "success" : "fail"}`,
        category: "STATUS",
        action: "ENHANCE_ITEM",
        status: "COMPLETED",
        createdAt: "2026-02-03T00:00:00Z",
        delta: null,
        extra: {
          type: "ENHANCE_ITEM",
          details: {
            item: {
              id: "inv-weapon-1",
              code: "weapon-wooden-sword",
              rarity: "epic",
              modifiers: [],
            },
            enhancement: {
              before: 1,
              after: success ? 2 : 1,
              success,
              chance: 0.8,
            },
          },
        },
      } as DungeonLogEntry;

      const message = buildLogDescription(entry);
      expect(message).toContain(expected);
    }
  );

  it("스토리 템플릿은 로그 ID 기준으로 고정 선택된다", () => {
    const entry = {
      id: "log-rest-started",
      category: "EXPLORATION",
      action: "REST",
      status: "STARTED",
      createdAt: "2025-12-01T00:00:00Z",
      delta: null,
    } as DungeonLogEntry;

    const messageA = buildLogDescription(entry);
    const messageB = buildLogDescription(entry);

    expect(messageA).toBe(messageB);
    expect([
      "잠시 숨을 고릅니다.",
      "안전한 곳을 찾아 휴식을 준비합니다.",
    ]).toContain(messageA);
  });
});

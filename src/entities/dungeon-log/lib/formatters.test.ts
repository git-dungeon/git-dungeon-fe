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
    expect(summary?.tone).toBe("gain");
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
    expect(floorDelta?.tone).toBe("gain");
    expect(floorProgress).toBeDefined();
    expect(floorProgress?.tone).toBe("gain");
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

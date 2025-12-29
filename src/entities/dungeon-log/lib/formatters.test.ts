import { describe, expect, it } from "vitest";
import type { DungeonLogEntry } from "@/entities/dungeon-log/model/types";
import { formatDelta } from "./formatters";

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
});

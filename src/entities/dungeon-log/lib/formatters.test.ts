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
              { itemCode: "ring-copper-band", quantity: 2 },
              { itemCode: "weapon-wooden-sword", quantity: 1 },
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
});

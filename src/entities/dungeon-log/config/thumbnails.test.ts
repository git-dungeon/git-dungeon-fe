import { describe, expect, it } from "vitest";
import type { DungeonLogEntry } from "@/entities/dungeon-log/model/types";
import { buildLogThumbnails } from "./thumbnails";

describe("buildLogThumbnails", () => {
  it("BATTLE 썸네일을 전투 -> 몬스터 -> 보상 -> 골드 순서로 생성한다", () => {
    const entry: DungeonLogEntry = {
      id: "log-battle-order",
      category: "EXPLORATION",
      floor: 1,
      action: "BATTLE",
      status: "COMPLETED",
      createdAt: "2025-12-01T00:00:00Z",
      delta: {
        type: "BATTLE",
        detail: {
          rewards: {
            gold: 5,
            items: [{ code: "ring-copper-band", quantity: 1 }],
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
          result: "VICTORY",
        },
      },
    };

    const thumbnails = buildLogThumbnails(entry);
    expect(thumbnails.map((thumbnail) => thumbnail.id)).toEqual([
      "log-battle-order-action",
      "log-battle-order-monster",
      "log-battle-order-reward-item",
      "log-battle-order-gold",
    ]);
  });
});

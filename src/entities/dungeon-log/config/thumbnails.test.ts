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
    };

    const thumbnails = buildLogThumbnails(entry);
    expect(thumbnails.map((thumbnail) => thumbnail.id)).toEqual([
      "log-battle-order-action",
      "log-battle-order-monster",
      "log-battle-order-reward-item",
      "log-battle-order-gold",
    ]);
  });

  it("TREASURE 썸네일을 보상보다 먼저 표시한다", () => {
    const entry: DungeonLogEntry = {
      id: "log-treasure-order",
      category: "EXPLORATION",
      floor: 1,
      action: "TREASURE",
      status: "COMPLETED",
      createdAt: "2025-12-01T00:00:00Z",
      delta: {
        type: "TREASURE",
        detail: {
          rewards: {
            gold: 10,
            items: [{ code: "ring-copper-band", quantity: 1 }],
          },
        },
      },
    };

    const thumbnails = buildLogThumbnails(entry);
    expect(thumbnails.map((thumbnail) => thumbnail.id)).toEqual([
      "log-treasure-order-action",
      "log-treasure-order-reward-item",
      "log-treasure-order-gold",
    ]);
  });
});

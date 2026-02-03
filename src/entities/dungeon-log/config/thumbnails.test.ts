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
      "log-battle-order-reward-item-1",
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
      "log-treasure-order-reward-item-1",
      "log-treasure-order-gold",
    ]);
  });

  it("BATTLE 보상 아이템이 여러 개면 썸네일을 모두 추가한다", () => {
    const entry: DungeonLogEntry = {
      id: "log-battle-multi-reward",
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
            items: [
              { code: "ring-copper-band", quantity: 1 },
              { code: "ring-silver-band", quantity: 1 },
            ],
          },
        },
      },
    };

    const thumbnails = buildLogThumbnails(entry);
    expect(thumbnails.map((thumbnail) => thumbnail.id)).toEqual([
      "log-battle-multi-reward-action",
      "log-battle-multi-reward-reward-item-1",
      "log-battle-multi-reward-reward-item-2",
      "log-battle-multi-reward-gold",
    ]);
  });

  it("STAT_APPLIED 로그에서 적용된 스탯 아이콘을 표시한다", () => {
    const entry: DungeonLogEntry = {
      id: "log-stat-applied",
      category: "STATUS",
      floor: null,
      action: "STAT_APPLIED",
      status: "COMPLETED",
      createdAt: "2025-12-01T00:00:00Z",
      delta: {
        type: "STAT_APPLIED",
        detail: {
          stats: {
            hp: 1,
            maxHp: 1,
          },
        },
      },
      extra: {
        type: "STAT_APPLIED",
        details: {
          applied: {
            hp: 1,
            maxHp: 1,
          },
        },
      },
    };

    const thumbnails = buildLogThumbnails(entry);
    expect(thumbnails.map((thumbnail) => thumbnail.id)).toEqual([
      "log-stat-applied-stat-hp",
    ]);
  });

  it("DISMANTLE_ITEM 로그에서 제거/추가 아이템 썸네일을 생성한다", () => {
    const entry: DungeonLogEntry = {
      id: "log-dismantle-thumb",
      category: "STATUS",
      floor: null,
      action: "DISMANTLE_ITEM",
      status: "COMPLETED",
      createdAt: "2025-12-01T00:00:00Z",
      delta: {
        type: "DISMANTLE_ITEM",
        detail: {
          inventory: {
            removed: [
              {
                itemId: "inv-weapon-1",
                code: "weapon-wooden-sword",
                slot: "weapon",
                rarity: "epic",
                quantity: 1,
              },
            ],
            added: [
              {
                itemId: "inv-material-1",
                code: "material-metal-scrap",
                slot: "material",
                quantity: 4,
              },
            ],
          },
        },
      },
      extra: null,
    };

    const thumbnails = buildLogThumbnails(entry);
    expect(thumbnails.map((thumbnail) => thumbnail.id)).toEqual([
      "log-dismantle-thumb-removed-item-1",
      "log-dismantle-thumb-added-item-1",
    ]);
    expect(thumbnails[0]?.badge).toBe("danger");
    expect(thumbnails[0]?.rarity).toBe("epic");
    expect(thumbnails[1]?.badge).toBe("success");
  });

  it("ENHANCE_ITEM 로그에서 강화 결과 아이템과 소모 재료를 표시한다", () => {
    const entry: DungeonLogEntry = {
      id: "log-enhance-thumb",
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
          },
          enhancement: {
            before: 1,
            after: 2,
            success: true,
            chance: 0.8,
          },
        },
      },
    };

    const thumbnails = buildLogThumbnails(entry);
    expect(thumbnails.map((thumbnail) => thumbnail.id)).toEqual([
      "log-enhance-thumb-action",
      "log-enhance-thumb-consumed-item-1",
      "log-enhance-thumb-enhanced-item",
    ]);
    expect(thumbnails[1]?.badge).toBe("danger");
    expect(thumbnails[2]?.badge).toBe("success");
    expect(thumbnails[2]?.rarity).toBe("epic");
  });
});

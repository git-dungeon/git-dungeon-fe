import { describe, expect, it } from "vitest";
import { logEntrySchema } from "./types";

describe("logEntrySchema", () => {
  it("BATTLE extra player stats에 maxHp가 있어도 파싱된다", () => {
    const parsed = logEntrySchema.safeParse({
      id: "log-1",
      category: "EXPLORATION",
      action: "BATTLE",
      status: "STARTED",
      floor: 44,
      turnNumber: 549,
      stateVersionBefore: 549,
      stateVersionAfter: null,
      createdAt: "2026-02-05T15:08:00.052Z",
      delta: {
        type: "BATTLE",
        detail: {
          stats: {
            ap: -1,
          },
        },
      },
      extra: {
        type: "BATTLE",
        details: {
          player: {
            hp: 43,
            atk: 12,
            def: 27,
            exp: 78,
            luck: 34,
            level: 17,
            maxHp: 54,
            stats: {
              base: {
                hp: 46,
                maxHp: 46,
                atk: 7,
                def: 18,
                luck: 34,
              },
              total: {
                hp: 54,
                maxHp: 54,
                atk: 12,
                def: 27,
                luck: 34,
              },
              equipmentBonus: {
                hp: 8,
                maxHp: 8,
                atk: 5,
                def: 9,
                luck: 0,
              },
            },
            expToLevel: 170,
          },
          monster: {
            hp: 46,
            atk: 6,
            def: 2,
            code: "monster-slime-elite",
            name: "Slime (Elite)",
            spriteId: "sprite/monster-slime",
          },
        },
      },
    });

    expect(parsed.success).toBe(true);
  });
});

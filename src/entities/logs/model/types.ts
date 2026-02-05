import { z } from "zod";
import { inventoryModifierSchema } from "@/entities/equipment/model/types";

export const LOGS_FILTER_TYPES = [
  "EXPLORATION",
  "STATUS",
  "BATTLE",
  "TREASURE",
  "REST",
  "TRAP",
  "EMPTY",
  "MOVE",
  "DEATH",
  "REVIVE",
  "ACQUIRE_ITEM",
  "EQUIP_ITEM",
  "UNEQUIP_ITEM",
  "DISCARD_ITEM",
  "DISMANTLE_ITEM",
  "ENHANCE_ITEM",
  "BUFF_APPLIED",
  "BUFF_EXPIRED",
  "LEVEL_UP",
  "STAT_APPLIED",
] as const;

export const logsFilterTypeSchema = z.enum(LOGS_FILTER_TYPES);
export type LogsFilterType = z.infer<typeof logsFilterTypeSchema>;

export const logsCategorySchema = z.enum(["EXPLORATION", "STATUS"]);
export type LogsCategory = z.infer<typeof logsCategorySchema>;

export const LOG_ACTIONS = [
  "BATTLE",
  "TREASURE",
  "REST",
  "TRAP",
  "EMPTY",
  "MOVE",
  "DEATH",
  "REVIVE",
  "ACQUIRE_ITEM",
  "EQUIP_ITEM",
  "UNEQUIP_ITEM",
  "DISCARD_ITEM",
  "DISMANTLE_ITEM",
  "ENHANCE_ITEM",
  "BUFF_APPLIED",
  "BUFF_EXPIRED",
  "LEVEL_UP",
  "STAT_APPLIED",
] as const;

export const logActionSchema = z.enum(LOG_ACTIONS);
export type LogAction = z.infer<typeof logActionSchema>;

export const logStatusSchema = z.enum(["STARTED", "COMPLETED"]);
export type LogStatus = z.infer<typeof logStatusSchema>;

export const logStatsDeltaSchema = z
  .object({
    hp: z.number().int().optional(),
    maxHp: z.number().int().optional(),
    atk: z.number().int().optional(),
    def: z.number().int().optional(),
    luck: z.number().int().optional(),
    ap: z.number().int().optional(),
    level: z.number().int().optional(),
    exp: z.number().int().optional(),
  })
  .strict();
export type LogStatsDelta = z.infer<typeof logStatsDeltaSchema>;

export const logProgressDeltaSchema = z
  .object({
    floor: z.number().int().optional(),
    floorProgress: z.number().int().optional(),
    previousProgress: z.number().int().optional(),
    delta: z.number().int().optional(),
  })
  .strict();
export type LogProgressDelta = z.infer<typeof logProgressDeltaSchema>;

export const logRewardItemSchema = z
  .object({
    code: z.string(),
    quantity: z.number().int().optional(),
  })
  .strict();
export type LogRewardItem = z.infer<typeof logRewardItemSchema>;

export const logRewardsDeltaSchema = z
  .object({
    gold: z.number().int().optional(),
    chests: z.number().int().optional(),
    items: z.array(logRewardItemSchema).optional(),
    buffs: z
      .array(
        z.object({
          buffId: z.string().optional(),
          source: z.string().optional(),
          totalTurns: z.number().int().nullable().optional(),
          remainingTurns: z.number().int().nullable().optional(),
        })
      )
      .optional(),
    unlocks: z.array(z.string()).optional(),
  })
  .strict();
export type LogRewardsDelta = z.infer<typeof logRewardsDeltaSchema>;

export const logInventoryDeltaItemSchema = z.object({
  itemId: z.string(),
  code: z.string(),
  slot: z.string().optional(),
  rarity: z.string().optional(),
  quantity: z.number().int().optional(),
});
export type LogInventoryDeltaItem = z.infer<typeof logInventoryDeltaItemSchema>;

export const logInventoryDeltaSchema = z.object({
  added: z.array(logInventoryDeltaItemSchema).optional(),
  removed: z.array(logInventoryDeltaItemSchema).optional(),
  equipped: logInventoryDeltaItemSchema.optional(),
  unequipped: logInventoryDeltaItemSchema.optional(),
});
export type LogInventoryDelta = z.infer<typeof logInventoryDeltaSchema>;

const dungeonLogBattleDeltaSchema = z.object({
  type: z.literal("BATTLE"),
  detail: z
    .object({
      stats: logStatsDeltaSchema.optional(),
      rewards: logRewardsDeltaSchema.optional(),
      progress: logProgressDeltaSchema.optional(),
    })
    .strict(),
});

const dungeonLogDeathDeltaSchema = z.object({
  type: z.literal("DEATH"),
  detail: z
    .object({
      stats: logStatsDeltaSchema,
      progress: logProgressDeltaSchema.optional(),
      buffs: z
        .array(
          z.object({
            buffId: z.string(),
            source: z.string(),
          })
        )
        .optional(),
    })
    .strict(),
});

const dungeonLogReviveDeltaSchema = z.object({
  type: z.literal("REVIVE"),
  detail: z
    .object({
      stats: logStatsDeltaSchema,
    })
    .strict(),
});

const dungeonLogRestDeltaSchema = z.object({
  type: z.literal("REST"),
  detail: z
    .object({
      stats: logStatsDeltaSchema,
      progress: logProgressDeltaSchema.optional(),
    })
    .strict(),
});

const dungeonLogTrapDeltaSchema = z.object({
  type: z.literal("TRAP"),
  detail: z
    .object({
      stats: logStatsDeltaSchema,
      progress: logProgressDeltaSchema.optional(),
    })
    .strict(),
});

const dungeonLogEmptyDeltaSchema = z.object({
  type: z.literal("EMPTY"),
  detail: z
    .object({
      stats: logStatsDeltaSchema.optional(),
      progress: logProgressDeltaSchema.optional(),
    })
    .strict(),
});

const dungeonLogTreasureDeltaSchema = z.object({
  type: z.literal("TREASURE"),
  detail: z
    .object({
      stats: logStatsDeltaSchema.optional(),
      rewards: logRewardsDeltaSchema.optional(),
      progress: logProgressDeltaSchema.optional(),
    })
    .strict(),
});

const dungeonLogMoveDeltaSchema = z.object({
  type: z.literal("MOVE"),
  detail: z
    .object({
      fromFloor: z.number().int(),
      toFloor: z.number().int(),
      previousProgress: z.number().int(),
      progress: logProgressDeltaSchema,
    })
    .strict(),
});

function inventoryDeltaWrapperSchema(
  type:
    | "ACQUIRE_ITEM"
    | "EQUIP_ITEM"
    | "UNEQUIP_ITEM"
    | "DISCARD_ITEM"
    | "DISMANTLE_ITEM"
    | "ENHANCE_ITEM"
) {
  return z.object({
    type: z.literal(type),
    detail: z
      .object({
        inventory: logInventoryDeltaSchema,
        stats: logStatsDeltaSchema.optional(),
      })
      .strict(),
  });
}

const dungeonLogAcquireItemDeltaSchema =
  inventoryDeltaWrapperSchema("ACQUIRE_ITEM");
const dungeonLogEquipItemDeltaSchema =
  inventoryDeltaWrapperSchema("EQUIP_ITEM");
const dungeonLogUnequipItemDeltaSchema =
  inventoryDeltaWrapperSchema("UNEQUIP_ITEM");
const dungeonLogDiscardItemDeltaSchema =
  inventoryDeltaWrapperSchema("DISCARD_ITEM");
const dungeonLogDismantleItemDeltaSchema =
  inventoryDeltaWrapperSchema("DISMANTLE_ITEM");
const dungeonLogEnhanceItemDeltaSchema =
  inventoryDeltaWrapperSchema("ENHANCE_ITEM");

const dungeonLogLevelUpDeltaSchema = z.object({
  type: z.literal("LEVEL_UP"),
  detail: z
    .object({
      stats: logStatsDeltaSchema,
      rewards: z
        .object({
          skillPoints: z.number().int().optional(),
          unlocks: z.array(z.string()).optional(),
        })
        .optional(),
    })
    .strict(),
});

const dungeonLogStatAppliedDeltaSchema = z.object({
  type: z.literal("STAT_APPLIED"),
  detail: z
    .object({
      stats: logStatsDeltaSchema,
    })
    .strict(),
});

function buffDeltaSchema(type: "BUFF_APPLIED" | "BUFF_EXPIRED") {
  return z.object({
    type: z.literal(type),
    detail: z
      .object({
        applied: z
          .array(
            z.object({
              buffId: z.string(),
              source: z.string(),
              totalTurns: z.number().int().nullable().optional(),
              remainingTurns: z.number().int().nullable().optional(),
            })
          )
          .optional(),
        expired: z
          .array(
            z.object({
              buffId: z.string(),
              expiredAtTurn: z.number().int(),
              consumedBy: z.string(),
            })
          )
          .optional(),
      })
      .strict(),
  });
}

const dungeonLogBuffAppliedDeltaSchema = buffDeltaSchema("BUFF_APPLIED");
const dungeonLogBuffExpiredDeltaSchema = buffDeltaSchema("BUFF_EXPIRED");

export const logDeltaSchema = z.union([
  dungeonLogBattleDeltaSchema,
  dungeonLogDeathDeltaSchema,
  dungeonLogReviveDeltaSchema,
  dungeonLogRestDeltaSchema,
  dungeonLogTrapDeltaSchema,
  dungeonLogEmptyDeltaSchema,
  dungeonLogTreasureDeltaSchema,
  dungeonLogMoveDeltaSchema,
  dungeonLogAcquireItemDeltaSchema,
  dungeonLogEquipItemDeltaSchema,
  dungeonLogUnequipItemDeltaSchema,
  dungeonLogDiscardItemDeltaSchema,
  dungeonLogDismantleItemDeltaSchema,
  dungeonLogEnhanceItemDeltaSchema,
  dungeonLogLevelUpDeltaSchema,
  dungeonLogStatAppliedDeltaSchema,
  dungeonLogBuffAppliedDeltaSchema,
  dungeonLogBuffExpiredDeltaSchema,
]);
export type LogDelta = z.infer<typeof logDeltaSchema>;

export const logMonsterSchema = z.object({
  code: z.string(),
  name: z.string(),
  hp: z.number().int().optional(),
  atk: z.number().int().optional(),
  def: z.number().int().optional(),
  spriteId: z.string().optional(),
});
export type LogMonster = z.infer<typeof logMonsterSchema>;

const dungeonLogStatBlockSchema = z
  .object({
    hp: z.number().int(),
    atk: z.number().int(),
    def: z.number().int(),
    luck: z.number().int(),
  })
  .strict();

const dungeonLogBattlePlayerStatsSchema = z
  .object({
    base: dungeonLogStatBlockSchema,
    equipmentBonus: dungeonLogStatBlockSchema,
    total: dungeonLogStatBlockSchema,
  })
  .strict();

const dungeonLogBattlePlayerSnapshotSchema = z
  .object({
    hp: z.number().int(),
    maxHp: z.number().int(),
    atk: z.number().int(),
    def: z.number().int(),
    luck: z.number().int(),
    stats: dungeonLogBattlePlayerStatsSchema,
    level: z.number().int(),
    exp: z.number().int(),
    expToLevel: z.number().int().optional(),
  })
  .strict();

export type LogBattlePlayerSnapshot = z.infer<
  typeof dungeonLogBattlePlayerSnapshotSchema
>;

const dungeonLogBattleDetailsSchema = z.object({
  type: z.literal("BATTLE"),
  details: z
    .object({
      monster: logMonsterSchema,
      player: dungeonLogBattlePlayerSnapshotSchema,
      result: z.enum(["VICTORY", "DEFEAT"]).optional(),
      cause: z.string().optional(),
      expGained: z.number().int().optional(),
      turns: z.number().int().optional(),
      damageDealt: z.number().int().optional(),
      damageTaken: z.number().int().optional(),
    })
    .strict(),
});

const dungeonLogDeathDetailsSchema = z.object({
  type: z.literal("DEATH"),
  details: z.object({ cause: z.string(), handledBy: z.string().optional() }),
});

const dungeonLogAcquireItemDetailsSchema = z.object({
  type: z.literal("ACQUIRE_ITEM"),
  details: z.object({
    reward: z.object({
      source: z.string(),
      drop: z
        .object({
          tableId: z.string(),
          isElite: z.boolean(),
          items: z
            .array(
              z.object({
                code: z.string(),
                quantity: z.number().int(),
              })
            )
            .optional(),
        })
        .optional(),
    }),
  }),
});

const dungeonLogInventoryDetailItemSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string().nullable().optional(),
  rarity: z.string().optional(),
  modifiers: z.array(inventoryModifierSchema).optional(),
});

const dungeonLogReplacedItemSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string().optional(),
  rarity: z.string().optional(),
});

const dungeonLogEquipItemDetailsSchema = z.object({
  type: z.literal("EQUIP_ITEM"),
  details: z.object({
    item: dungeonLogInventoryDetailItemSchema,
  }),
});

const dungeonLogUnequipItemDetailsSchema = z.object({
  type: z.literal("UNEQUIP_ITEM"),
  details: z.object({
    item: dungeonLogInventoryDetailItemSchema,
    replacedItem: dungeonLogReplacedItemSchema.optional(),
  }),
});

const dungeonLogDiscardItemDetailsSchema = z.object({
  type: z.literal("DISCARD_ITEM"),
  details: z.object({
    item: dungeonLogInventoryDetailItemSchema,
    replacedItem: dungeonLogReplacedItemSchema.optional(),
  }),
});

const dungeonLogDismantleItemDetailsSchema = z.object({
  type: z.literal("DISMANTLE_ITEM"),
  details: z.object({
    item: dungeonLogInventoryDetailItemSchema,
    materials: z
      .array(
        z.object({
          code: z.string(),
          quantity: z.number().int().optional(),
        })
      )
      .optional(),
  }),
});

const dungeonLogEnhanceItemDetailsSchema = z.object({
  type: z.literal("ENHANCE_ITEM"),
  details: z.object({
    item: dungeonLogInventoryDetailItemSchema,
    enhancement: z
      .object({
        before: z.number().int(),
        after: z.number().int(),
        success: z.boolean(),
        chance: z.number(),
      })
      .optional(),
    cost: z
      .object({
        gold: z.number().int(),
        materials: z
          .array(
            z.object({
              code: z.string(),
              quantity: z.number().int().optional(),
            })
          )
          .optional(),
      })
      .optional(),
  }),
});

const dungeonLogLevelUpDetailsSchema = z.object({
  type: z.literal("LEVEL_UP"),
  details: z.object({
    previousLevel: z.number().int(),
    currentLevel: z.number().int(),
    threshold: z.number().int(),
    statsGained: z
      .object({
        hp: z.number().int().optional(),
        maxHp: z.number().int().optional(),
        atk: z.number().int().optional(),
        def: z.number().int().optional(),
        luck: z.number().int().optional(),
      })
      .optional(),
  }),
});

const dungeonLogStatAppliedDetailsSchema = z.object({
  type: z.literal("STAT_APPLIED"),
  details: z
    .object({
      applied: logStatsDeltaSchema,
    })
    .strict(),
});

const dungeonLogRestDetailsSchema = z.object({
  type: z.literal("REST"),
  details: z.object({ source: z.string().optional() }).strict(),
});

const dungeonLogTrapDetailsSchema = z.object({
  type: z.literal("TRAP"),
  details: z.object({ trapCode: z.string().optional() }).strict(),
});

const dungeonLogTreasureDetailsSchema = z.object({
  type: z.literal("TREASURE"),
  details: z
    .object({
      rewardCode: z.string().optional(),
      rarity: z.string().optional(),
    })
    .strict(),
});

const dungeonLogMoveDetailsSchema = z.object({
  type: z.literal("MOVE"),
  details: z
    .object({
      rewards: z
        .object({
          gold: z.number().int().optional(),
          buff: z.record(z.string(), z.unknown()).optional(),
        })
        .strict()
        .optional(),
    })
    .strict(),
});

const dungeonLogBuffDetailsSchema = z.object({
  type: z.enum(["BUFF_APPLIED", "BUFF_EXPIRED"]),
  details: z.object({
    buffId: z.string(),
    source: z.string().optional(),
    spriteId: z.string().optional(),
    effect: z.string().optional(),
    totalTurns: z.number().int().nullable().optional(),
    remainingTurns: z.number().int().nullable().optional(),
    expiredAtTurn: z.number().int().optional(),
    consumedBy: z.string().optional(),
  }),
});

export const logDetailsSchema = z.union([
  dungeonLogBattleDetailsSchema,
  dungeonLogDeathDetailsSchema,
  dungeonLogAcquireItemDetailsSchema,
  dungeonLogEquipItemDetailsSchema,
  dungeonLogUnequipItemDetailsSchema,
  dungeonLogDiscardItemDetailsSchema,
  dungeonLogDismantleItemDetailsSchema,
  dungeonLogEnhanceItemDetailsSchema,
  dungeonLogLevelUpDetailsSchema,
  dungeonLogStatAppliedDetailsSchema,
  dungeonLogRestDetailsSchema,
  dungeonLogTrapDetailsSchema,
  dungeonLogTreasureDetailsSchema,
  dungeonLogMoveDetailsSchema,
  dungeonLogBuffDetailsSchema,
]);
export type LogDetails = z.infer<typeof logDetailsSchema>;

export const logEntrySchema = z.object({
  id: z.string(),
  category: logsCategorySchema,
  floor: z.number().int().nullable().optional(),
  action: logActionSchema,
  status: logStatusSchema,
  createdAt: z.string(),
  turnNumber: z.number().int().nullable().optional(),
  stateVersionBefore: z.number().int().nullable().optional(),
  stateVersionAfter: z.number().int().nullable().optional(),
  delta: logDeltaSchema.nullable().optional(),
  extra: logDetailsSchema.nullable().optional(),
});
export type LogEntry = z.infer<typeof logEntrySchema>;

export const logsPayloadSchema = z.object({
  logs: z.array(logEntrySchema),
  nextCursor: z.string().nullable().optional(),
});
export type LogsPayload = z.infer<typeof logsPayloadSchema>;

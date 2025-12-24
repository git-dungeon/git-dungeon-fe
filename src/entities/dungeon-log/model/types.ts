import { z } from "zod";
import { inventoryModifierSchema } from "@/entities/dashboard/model/types";

export const DUNGEON_LOGS_FILTER_TYPES = [
  "EXPLORATION",
  "STATUS",
  "BATTLE",
  "TREASURE",
  "REST",
  "TRAP",
  "MOVE",
  "DEATH",
  "REVIVE",
  "ACQUIRE_ITEM",
  "EQUIP_ITEM",
  "UNEQUIP_ITEM",
  "DISCARD_ITEM",
  "BUFF_APPLIED",
  "BUFF_EXPIRED",
  "LEVEL_UP",
] as const;

export const dungeonLogsFilterTypeSchema = z.enum(DUNGEON_LOGS_FILTER_TYPES);
export type DungeonLogsFilterType = z.infer<typeof dungeonLogsFilterTypeSchema>;

export const dungeonLogCategorySchema = z.enum(["EXPLORATION", "STATUS"]);
export type DungeonLogCategory = z.infer<typeof dungeonLogCategorySchema>;

export const DUNGEON_LOG_ACTIONS = [
  "BATTLE",
  "TREASURE",
  "REST",
  "TRAP",
  "MOVE",
  "DEATH",
  "REVIVE",
  "ACQUIRE_ITEM",
  "EQUIP_ITEM",
  "UNEQUIP_ITEM",
  "DISCARD_ITEM",
  "BUFF_APPLIED",
  "BUFF_EXPIRED",
  "LEVEL_UP",
] as const;

export const dungeonLogActionSchema = z.enum(DUNGEON_LOG_ACTIONS);
export type DungeonLogAction = z.infer<typeof dungeonLogActionSchema>;

export const dungeonLogStatusSchema = z.enum(["STARTED", "COMPLETED"]);
export type DungeonLogStatus = z.infer<typeof dungeonLogStatusSchema>;

export const dungeonLogStatsDeltaSchema = z
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
export type DungeonLogStatsDelta = z.infer<typeof dungeonLogStatsDeltaSchema>;

export const dungeonLogProgressDeltaSchema = z
  .object({
    floor: z.number().int().optional(),
    floorProgress: z.number().int().optional(),
    previousProgress: z.number().int().optional(),
    delta: z.number().int().optional(),
  })
  .strict();
export type DungeonLogProgressDelta = z.infer<
  typeof dungeonLogProgressDeltaSchema
>;

export const dungeonLogRewardItemSchema = z
  .object({
    code: z.string(),
    quantity: z.number().int().optional(),
  })
  .strict();
export type DungeonLogRewardItem = z.infer<typeof dungeonLogRewardItemSchema>;

export const dungeonLogRewardsDeltaSchema = z
  .object({
    gold: z.number().int().optional(),
    items: z.array(dungeonLogRewardItemSchema).optional(),
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
export type DungeonLogRewardsDelta = z.infer<
  typeof dungeonLogRewardsDeltaSchema
>;

export const dungeonLogInventoryDeltaItemSchema = z.object({
  itemId: z.string(),
  code: z.string(),
  slot: z.string().optional(),
  rarity: z.string().optional(),
  quantity: z.number().int().optional(),
});
export type DungeonLogInventoryDeltaItem = z.infer<
  typeof dungeonLogInventoryDeltaItemSchema
>;

export const dungeonLogInventoryDeltaSchema = z.object({
  added: z.array(dungeonLogInventoryDeltaItemSchema).optional(),
  removed: z.array(dungeonLogInventoryDeltaItemSchema).optional(),
  equipped: dungeonLogInventoryDeltaItemSchema.optional(),
  unequipped: dungeonLogInventoryDeltaItemSchema.optional(),
});
export type DungeonLogInventoryDelta = z.infer<
  typeof dungeonLogInventoryDeltaSchema
>;

const dungeonLogBattleDeltaSchema = z.object({
  type: z.literal("BATTLE"),
  detail: z
    .object({
      stats: dungeonLogStatsDeltaSchema.optional(),
      rewards: dungeonLogRewardsDeltaSchema.optional(),
      progress: dungeonLogProgressDeltaSchema.optional(),
    })
    .strict(),
});

const dungeonLogDeathDeltaSchema = z.object({
  type: z.literal("DEATH"),
  detail: z
    .object({
      stats: dungeonLogStatsDeltaSchema,
      progress: dungeonLogProgressDeltaSchema.optional(),
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
      stats: dungeonLogStatsDeltaSchema,
    })
    .strict(),
});

const dungeonLogRestDeltaSchema = z.object({
  type: z.literal("REST"),
  detail: z
    .object({
      stats: dungeonLogStatsDeltaSchema,
      progress: dungeonLogProgressDeltaSchema.optional(),
    })
    .strict(),
});

const dungeonLogTrapDeltaSchema = z.object({
  type: z.literal("TRAP"),
  detail: z
    .object({
      stats: dungeonLogStatsDeltaSchema,
      progress: dungeonLogProgressDeltaSchema.optional(),
    })
    .strict(),
});

const dungeonLogTreasureDeltaSchema = z.object({
  type: z.literal("TREASURE"),
  detail: z
    .object({
      stats: dungeonLogStatsDeltaSchema.optional(),
      rewards: dungeonLogRewardsDeltaSchema.optional(),
      progress: dungeonLogProgressDeltaSchema.optional(),
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
      progress: dungeonLogProgressDeltaSchema,
    })
    .strict(),
});

function inventoryDeltaWrapperSchema(
  type: "ACQUIRE_ITEM" | "EQUIP_ITEM" | "UNEQUIP_ITEM" | "DISCARD_ITEM"
) {
  return z.object({
    type: z.literal(type),
    detail: z
      .object({
        inventory: dungeonLogInventoryDeltaSchema,
        stats: dungeonLogStatsDeltaSchema.optional(),
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

const dungeonLogLevelUpDeltaSchema = z.object({
  type: z.literal("LEVEL_UP"),
  detail: z
    .object({
      stats: dungeonLogStatsDeltaSchema,
      rewards: z
        .object({
          skillPoints: z.number().int().optional(),
          unlocks: z.array(z.string()).optional(),
        })
        .optional(),
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

export const dungeonLogDeltaSchema = z.union([
  dungeonLogBattleDeltaSchema,
  dungeonLogDeathDeltaSchema,
  dungeonLogReviveDeltaSchema,
  dungeonLogRestDeltaSchema,
  dungeonLogTrapDeltaSchema,
  dungeonLogTreasureDeltaSchema,
  dungeonLogMoveDeltaSchema,
  dungeonLogAcquireItemDeltaSchema,
  dungeonLogEquipItemDeltaSchema,
  dungeonLogUnequipItemDeltaSchema,
  dungeonLogDiscardItemDeltaSchema,
  dungeonLogLevelUpDeltaSchema,
  dungeonLogBuffAppliedDeltaSchema,
  dungeonLogBuffExpiredDeltaSchema,
]);
export type DungeonLogDelta = z.infer<typeof dungeonLogDeltaSchema>;

export const dungeonLogMonsterSchema = z.object({
  code: z.string(),
  name: z.string(),
  hp: z.number().int().optional(),
  atk: z.number().int().optional(),
  def: z.number().int().optional(),
  spriteId: z.string().optional(),
});
export type DungeonLogMonster = z.infer<typeof dungeonLogMonsterSchema>;

const dungeonLogBattleDetailsSchema = z.object({
  type: z.literal("BATTLE"),
  details: z
    .object({
      monster: dungeonLogMonsterSchema,
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

export const dungeonLogDetailsSchema = z.union([
  dungeonLogBattleDetailsSchema,
  dungeonLogDeathDetailsSchema,
  dungeonLogAcquireItemDetailsSchema,
  dungeonLogEquipItemDetailsSchema,
  dungeonLogUnequipItemDetailsSchema,
  dungeonLogDiscardItemDetailsSchema,
  dungeonLogLevelUpDetailsSchema,
  dungeonLogRestDetailsSchema,
  dungeonLogTrapDetailsSchema,
  dungeonLogTreasureDetailsSchema,
  dungeonLogMoveDetailsSchema,
  dungeonLogBuffDetailsSchema,
]);
export type DungeonLogDetails = z.infer<typeof dungeonLogDetailsSchema>;

export const dungeonLogEntrySchema = z.object({
  id: z.string(),
  category: dungeonLogCategorySchema,
  floor: z.number().int().nullable().optional(),
  action: dungeonLogActionSchema,
  status: dungeonLogStatusSchema,
  createdAt: z.string(),
  turnNumber: z.number().int().nullable().optional(),
  stateVersionBefore: z.number().int().nullable().optional(),
  stateVersionAfter: z.number().int().nullable().optional(),
  delta: dungeonLogDeltaSchema.nullable().optional(),
  extra: dungeonLogDetailsSchema.nullable().optional(),
});
export type DungeonLogEntry = z.infer<typeof dungeonLogEntrySchema>;

export const dungeonLogsPayloadSchema = z.object({
  logs: z.array(dungeonLogEntrySchema),
  nextCursor: z.string().nullable().optional(),
});
export type DungeonLogsPayload = z.infer<typeof dungeonLogsPayloadSchema>;

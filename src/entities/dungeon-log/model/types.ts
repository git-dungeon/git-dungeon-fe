import { z } from "zod";

export const dungeonLogCategorySchema = z.enum(["exploration", "status"]);
export type DungeonLogCategory = z.infer<typeof dungeonLogCategorySchema>;

export const dungeonActionSchema = z.enum([
  "battle",
  "treasure",
  "empty",
  "rest",
  "trap",
  "move",
  "equip",
  "unequip",
  "discard",
]);
export type DungeonAction = z.infer<typeof dungeonActionSchema>;

export const dungeonLogStatusSchema = z.enum(["started", "completed"]);
export type DungeonLogStatus = z.infer<typeof dungeonLogStatusSchema>;

export const dungeonLogStatDeltaSchema = z.object({
  hp: z.number().optional(),
  atk: z.number().optional(),
  def: z.number().optional(),
  luck: z.number().optional(),
});
export type DungeonLogStatDelta = z.infer<typeof dungeonLogStatDeltaSchema>;

export const dungeonLogDeltaSchema = z.object({
  ap: z.number(),
  hp: z.number().optional(),
  gold: z.number().optional(),
  exp: z.number().optional(),
  item: z.string().optional(),
  progress: z.number().optional(),
  slot: z.string().optional(),
  stats: dungeonLogStatDeltaSchema.optional(),
});
export type DungeonLogDelta = z.infer<typeof dungeonLogDeltaSchema>;

export const dungeonLogMonsterSchema = z.object({
  id: z.string(),
  name: z.string(),
  hp: z.number(),
  atk: z.number(),
  sprite: z.string().optional(),
});
export type DungeonLogMonster = z.infer<typeof dungeonLogMonsterSchema>;

const dungeonLogBattleDetailsSchema = z.object({
  type: z.literal("battle"),
  monster: dungeonLogMonsterSchema,
});

const dungeonLogGenericDetailsSchema = z.object({
  type: z.literal("generic"),
});

export const dungeonLogDetailsSchema = z.discriminatedUnion("type", [
  dungeonLogBattleDetailsSchema,
  dungeonLogGenericDetailsSchema,
]);
export type DungeonLogDetails = z.infer<typeof dungeonLogDetailsSchema>;

export const dungeonLogEntrySchema = z.object({
  id: z.string(),
  category: dungeonLogCategorySchema,
  floor: z.number(),
  action: dungeonActionSchema,
  status: dungeonLogStatusSchema,
  createdAt: z.string(),
  delta: dungeonLogDeltaSchema,
  details: dungeonLogDetailsSchema.optional(),
});
export type DungeonLogEntry = z.infer<typeof dungeonLogEntrySchema>;

export const dungeonLogsResponseSchema = z.object({
  logs: z.array(dungeonLogEntrySchema),
  nextCursor: z.string().optional(),
});
export type DungeonLogsResponse = z.infer<typeof dungeonLogsResponseSchema>;

import { z } from "zod";

export const levelUpStatSchema = z.enum(["hp", "atk", "def", "luck"]);
export type LevelUpStat = z.infer<typeof levelUpStatSchema>;

export const levelUpRaritySchema = z.enum([
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
]);
export type LevelUpRarity = z.infer<typeof levelUpRaritySchema>;

export const levelUpOptionSchema = z
  .object({
    stat: levelUpStatSchema,
    rarity: levelUpRaritySchema,
    value: z.number(),
  })
  .strict();
export type LevelUpOption = z.infer<typeof levelUpOptionSchema>;

export const levelUpSelectionResponseSchema = z
  .object({
    points: z.number(),
    rollIndex: z.number(),
    options: z.array(levelUpOptionSchema),
  })
  .strict();
export type LevelUpSelectionResponse = z.infer<
  typeof levelUpSelectionResponseSchema
>;

export const levelUpStatBlockSchema = z
  .object({
    hp: z.number(),
    maxHp: z.number(),
    atk: z.number(),
    def: z.number(),
    luck: z.number(),
  })
  .strict();
export type LevelUpStatBlock = z.infer<typeof levelUpStatBlockSchema>;

export const levelUpApplyResponseSchema = z
  .object({
    points: z.number(),
    rollIndex: z.number(),
    applied: levelUpOptionSchema,
    stats: levelUpStatBlockSchema,
  })
  .strict();
export type LevelUpApplyResponse = z.infer<typeof levelUpApplyResponseSchema>;

export const levelUpApplyRequestSchema = z
  .object({
    stat: levelUpStatSchema,
    rollIndex: z.number(),
  })
  .strict();
export type LevelUpApplyRequest = z.infer<typeof levelUpApplyRequestSchema>;

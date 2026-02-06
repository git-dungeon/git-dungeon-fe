import { z } from "zod";
import { equipmentItemSchema } from "@/entities/equipment/model/types";

const equipmentStatBlockSchema = z
  .object({
    hp: z.number(),
    maxHp: z.number(),
    atk: z.number(),
    def: z.number(),
    luck: z.number(),
  })
  .strict();

const equipmentStatSummarySchema = z
  .object({
    base: equipmentStatBlockSchema,
    equipmentBonus: equipmentStatBlockSchema,
    total: equipmentStatBlockSchema,
  })
  .strict();

export const dashboardCurrentActionSchema = z.enum([
  "IDLE",
  "EXPLORING",
  "BATTLE",
  "REST",
  "TREASURE",
  "TRAP",
  "EMPTY",
]);
export type DashboardCurrentAction = z.infer<
  typeof dashboardCurrentActionSchema
>;

export const dashboardStateSchema = z.object({
  userId: z.string(),
  level: z.number(),
  exp: z.number(),
  expToLevel: z.number().nullable().optional(),
  levelUpPoints: z.number(),
  unopenedChests: z.number(),
  hp: z.number(),
  maxHp: z.number(),
  atk: z.number(),
  def: z.number(),
  luck: z.number(),
  floor: z.number(),
  maxFloor: z.number(),
  floorProgress: z.number(),
  gold: z.number(),
  ap: z.number(),
  currentAction: dashboardCurrentActionSchema,
  currentActionStartedAt: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  version: z.number(),
  stats: equipmentStatSummarySchema,
  equippedItems: z.array(equipmentItemSchema),
  lastActionCompletedAt: z.string().optional(),
  nextActionStartAt: z.string().optional(),
});
export type DashboardState = z.infer<typeof dashboardStateSchema>;

export const dashboardResponseSchema = z.object({
  state: dashboardStateSchema,
});
export type DashboardResponse = z.infer<typeof dashboardResponseSchema>;

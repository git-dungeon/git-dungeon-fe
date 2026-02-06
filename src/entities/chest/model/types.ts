import { z } from "zod";
import {
  equipmentItemSlotSchema,
  equipmentRaritySchema,
} from "@/entities/equipment/model/types";

export const chestOpenItemSchema = z
  .object({
    itemId: z.string(),
    code: z.string(),
    slot: equipmentItemSlotSchema,
    rarity: equipmentRaritySchema,
    quantity: z.number().min(1),
  })
  .strict();
export type ChestOpenItem = z.infer<typeof chestOpenItemSchema>;

export const chestOpenResponseSchema = z
  .object({
    remainingChests: z.number(),
    rollIndex: z.number(),
    items: z.array(chestOpenItemSchema),
  })
  .strict();
export type ChestOpenResponse = z.infer<typeof chestOpenResponseSchema>;

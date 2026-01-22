import { z } from "zod";

export const rankingEntrySchema = z.object({
  rank: z.number().int(),
  displayName: z.string().nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
  level: z.number().int(),
  maxFloor: z.number().int(),
});

export const rankingListSchema = z.object({
  rankings: z.array(rankingEntrySchema),
  nextCursor: z.string().nullable().optional(),
});

export type RankingEntry = z.infer<typeof rankingEntrySchema>;
export type RankingList = z.infer<typeof rankingListSchema>;

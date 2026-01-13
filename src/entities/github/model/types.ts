import { z } from "zod";

const githubTokenTypeSchema = z.enum(["oauth", "pat"]);

const githubSyncMetaSchema = z
  .object({
    remaining: z.number().int().nullable(),
    resetAt: z.number().int().nullable(),
    resource: z.string().nullable(),
  })
  .strict();

export const githubSyncDataSchema = z
  .object({
    contributions: z.number().int(),
    windowStart: z.string().datetime(),
    windowEnd: z.string().datetime(),
    tokenType: githubTokenTypeSchema,
    rateLimitRemaining: z.number().int().nullable().optional(),
    logId: z.string().uuid(),
    meta: githubSyncMetaSchema.optional(),
  })
  .strict();

export type GithubSyncData = z.infer<typeof githubSyncDataSchema>;

export const githubSyncStatusDataSchema = z
  .object({
    connected: z.boolean(),
    allowed: z.boolean(),
    cooldownMs: z.number(),
    lastSyncAt: z.string().nullable(),
    lastManualSyncAt: z.string().nullable(),
    nextAvailableAt: z.string().nullable(),
    retryAfterMs: z.number().nullable(),
  })
  .strict();

export type GithubSyncStatusData = z.infer<typeof githubSyncStatusDataSchema>;

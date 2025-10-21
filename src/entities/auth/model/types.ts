import { z } from "zod";

export const authSessionSchema = z.object({
  userId: z.string(),
  username: z.string(),
  email: z.string().email(),
  avatarUrl: z.string().optional(),
  displayName: z.string().optional(),
});

export type AuthSession = z.infer<typeof authSessionSchema>;

export const authSessionPayloadSchema = z.object({
  session: authSessionSchema.nullable().optional(),
  refreshed: z.boolean().optional(),
});

export type AuthSessionPayload = z.infer<typeof authSessionPayloadSchema>;

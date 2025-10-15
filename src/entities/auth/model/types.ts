import { z } from "zod";

export const authSessionSchema = z.object({
  userId: z.string(),
  username: z.string(),
  avatarUrl: z.string().optional(),
  displayName: z.string().optional(),
});

export type AuthSession = z.infer<typeof authSessionSchema>;

export const authSessionPayloadSchema = z.object({
  session: authSessionSchema.nullable().optional(),
  accessToken: z.string().optional(),
});

export type AuthSessionPayload = z.infer<typeof authSessionPayloadSchema>;

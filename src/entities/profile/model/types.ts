import { z } from "zod";
import { authSessionSchema } from "@/entities/auth/model/types";
export type {
  LanguagePreference,
  ThemePreference,
} from "@/shared/lib/preferences/types";

export const profileSchema = authSessionSchema.extend({
  email: z.string().optional(),
  joinedAt: z.string().optional(),
});
export type Profile = z.infer<typeof profileSchema>;

const profileGithubConnectionSchema = z.object({
  connected: z.boolean(),
  lastSyncAt: z.string().optional(),
});

export const profileConnectionsSchema = z.object({
  github: profileGithubConnectionSchema.optional(),
});
export type ProfileConnections = z.infer<typeof profileConnectionsSchema>;

export const profileOverviewSchema = z.object({
  profile: profileSchema,
  connections: profileConnectionsSchema,
});
export type ProfileOverview = z.infer<typeof profileOverviewSchema>;
export const profileResponseSchema = profileOverviewSchema;

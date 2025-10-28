import { requestWithSchema } from "@/shared/api/http-client";
import { SETTINGS_ENDPOINTS } from "@/shared/config/env";
import {
  profileResponseSchema,
  type ProfileOverview,
} from "@/entities/profile/model/types";

export async function getProfile(): Promise<ProfileOverview> {
  return requestWithSchema(SETTINGS_ENDPOINTS.profile, profileResponseSchema);
}

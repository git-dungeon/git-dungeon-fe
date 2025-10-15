import { httpGetWithSchema } from "@/shared/api/http-client";
import { SETTINGS_ENDPOINTS } from "@/shared/config/env";
import {
  settingsResponseSchema,
  type SettingsData,
} from "@/entities/settings/model/types";

export async function getSettings(): Promise<SettingsData> {
  const response = await httpGetWithSchema(
    SETTINGS_ENDPOINTS.profile,
    settingsResponseSchema
  );
  return response.settings;
}

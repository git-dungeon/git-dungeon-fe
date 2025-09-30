import { httpGet } from "@/shared/api/http-client";
import { SETTINGS_ENDPOINTS } from "@/shared/config/env";
import type {
  SettingsData,
  SettingsResponse,
} from "@/entities/settings/model/types";

export async function getSettings(): Promise<SettingsData> {
  const response = await httpGet<SettingsResponse>(SETTINGS_ENDPOINTS.profile, {
    parseAs: "json",
  });

  return response.settings;
}

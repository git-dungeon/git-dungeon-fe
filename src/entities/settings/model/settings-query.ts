import { queryOptions } from "@tanstack/react-query";
import { getSettings } from "@/entities/settings/api/get-settings";

export const SETTINGS_QUERY_KEY = ["settings", "profile"] as const;

export const settingsQueryOptions = queryOptions({
  queryKey: SETTINGS_QUERY_KEY,
  queryFn: getSettings,
  staleTime: 1000 * 60 * 2,
});

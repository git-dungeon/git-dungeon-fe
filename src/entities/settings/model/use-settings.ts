import { useQuery } from "@tanstack/react-query";
import { settingsQueryOptions } from "@/entities/settings/model/settings-query";

export function useSettings() {
  return useQuery(settingsQueryOptions);
}

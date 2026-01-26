import { queryOptions } from "@tanstack/react-query";
import { getLevelUpOptions } from "@/entities/level-up/api/get-level-up-options";

export const LEVEL_UP_SELECTION_QUERY_KEY = ["level-up", "selection"] as const;

export const levelUpSelectionQueryOptions = queryOptions({
  queryKey: LEVEL_UP_SELECTION_QUERY_KEY,
  queryFn: getLevelUpOptions,
  staleTime: 0,
});

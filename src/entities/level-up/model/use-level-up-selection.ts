import { useQuery } from "@tanstack/react-query";
import { levelUpSelectionQueryOptions } from "@/entities/level-up/model/level-up-query";

interface UseLevelUpSelectionOptions {
  enabled?: boolean;
}

export function useLevelUpSelection(options: UseLevelUpSelectionOptions = {}) {
  return useQuery({
    ...levelUpSelectionQueryOptions,
    enabled: options.enabled,
  });
}

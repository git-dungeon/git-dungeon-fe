import { useCallback, useMemo } from "react";
import { useDashboardState } from "@/entities/dashboard/model/use-dashboard-state";
import { useInventory } from "@/entities/inventory/model/use-inventory";
import {
  buildCharacterOverview,
  type CharacterOverview,
} from "@/features/character-summary/lib/build-character-overview";

export interface UseCharacterOverviewResult {
  data: CharacterOverview | null;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => Promise<void>;
  dashboard: ReturnType<typeof useDashboardState>;
  inventory: ReturnType<typeof useInventory>;
}

export function useCharacterOverview(): UseCharacterOverviewResult {
  const dashboard = useDashboardState();
  const inventory = useInventory();

  const data = useMemo(() => {
    if (!dashboard.data || !inventory.data) {
      return null;
    }

    return buildCharacterOverview(dashboard.data, inventory.data);
  }, [dashboard.data, inventory.data]);

  const isLoading = dashboard.isLoading || inventory.isLoading;
  const isFetching = dashboard.isFetching || inventory.isFetching;
  const isError = Boolean(dashboard.error || inventory.error);

  const refetch = useCallback(async () => {
    await Promise.all([dashboard.refetch(), inventory.refetch()]);
  }, [dashboard, inventory]);

  return {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
    dashboard,
    inventory,
  };
}

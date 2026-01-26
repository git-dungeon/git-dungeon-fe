import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { dashboardStateQueryOptions } from "@/entities/dashboard/model/dashboard-state-query";
import type { DashboardState } from "@/entities/dashboard/model/types";

interface UseDashboardStateOptions {
  enabled?: boolean;
}

export function useDashboardState(
  options: UseDashboardStateOptions = {}
): UseQueryResult<DashboardState> {
  return useQuery({
    ...dashboardStateQueryOptions,
    enabled: options.enabled,
  });
}

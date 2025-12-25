import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { dashboardStateQueryOptions } from "@/entities/dashboard/model/dashboard-state-query";
import type { DashboardState } from "@/entities/dashboard/model/types";

export function useDashboardState(): UseQueryResult<DashboardState> {
  return useQuery(dashboardStateQueryOptions);
}

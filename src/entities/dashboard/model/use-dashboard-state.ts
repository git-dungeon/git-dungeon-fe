import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { dashboardStateQueryOptions } from "@/entities/dashboard/model/dashboard-state-query";
import type { DashboardResponse } from "@/entities/dashboard/model/types";

export function useDashboardState(): UseQueryResult<DashboardResponse> {
  return useQuery(dashboardStateQueryOptions);
}

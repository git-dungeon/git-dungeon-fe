import { queryOptions } from "@tanstack/react-query";
import { getDashboardState } from "@/entities/dashboard/api/get-dashboard-state";

export const DASHBOARD_STATE_QUERY_KEY = ["dashboard", "state"] as const;

export const dashboardStateQueryOptions = queryOptions({
  queryKey: DASHBOARD_STATE_QUERY_KEY,
  queryFn: getDashboardState,
  staleTime: 1000 * 30,
});

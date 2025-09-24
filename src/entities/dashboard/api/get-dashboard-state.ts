import { DASHBOARD_ENDPOINTS } from "@/shared/config/env";
import { httpGet } from "@/shared/api/http-client";
import type { DashboardResponse } from "@/entities/dashboard/model/types";

export async function getDashboardState(): Promise<DashboardResponse> {
  return httpGet<DashboardResponse>(DASHBOARD_ENDPOINTS.state);
}

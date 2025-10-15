import { DASHBOARD_ENDPOINTS } from "@/shared/config/env";
import { httpGetWithSchema } from "@/shared/api/http-client";
import {
  dashboardResponseSchema,
  type DashboardResponse,
} from "@/entities/dashboard/model/types";

export async function getDashboardState(): Promise<DashboardResponse> {
  return httpGetWithSchema(DASHBOARD_ENDPOINTS.state, dashboardResponseSchema);
}

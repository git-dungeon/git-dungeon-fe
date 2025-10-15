import { DASHBOARD_ENDPOINTS } from "@/shared/config/env";
import { requestWithSchema } from "@/shared/api/http-client";
import {
  dashboardResponseSchema,
  type DashboardResponse,
} from "@/entities/dashboard/model/types";

export async function getDashboardState(): Promise<DashboardResponse> {
  return requestWithSchema(DASHBOARD_ENDPOINTS.state, dashboardResponseSchema);
}

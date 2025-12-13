import { DASHBOARD_ENDPOINTS } from "@/shared/config/env";
import { requestWithSchema } from "@/shared/api/http-client";
import {
  dashboardResponseSchema,
  type DashboardState,
} from "@/entities/dashboard/model/types";

export async function getDashboardState(): Promise<DashboardState> {
  const payload = await requestWithSchema(
    DASHBOARD_ENDPOINTS.state,
    dashboardResponseSchema
  );

  return payload.state;
}

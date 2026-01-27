import { createFileRoute } from "@tanstack/react-router";
import {
  dashboardStateQueryOptions,
  DASHBOARD_STATE_QUERY_KEY,
} from "@/entities/dashboard/model/dashboard-state-query";
import { catalogQueryOptions } from "@/entities/catalog/model/catalog-query";
import type { DashboardState } from "@/entities/dashboard/model/types";
import { ensureOnboardingComplete } from "@/shared/lib/navigation/ensure-onboarding-complete";
import { ensureQueryDataSafe } from "@/shared/lib/query/ensure-query-data-safe";
import { ChestPage } from "@/pages/chest/ui/chest-page";

export const Route = createFileRoute("/chest")({
  beforeLoad: async ({ context, location }) => {
    await context.auth.authorize({ location });
    await ensureOnboardingComplete(context.queryClient);
  },
  loader: async ({ context }) => {
    await context.auth.ensureSession();
    await ensureQueryDataSafe(context.queryClient, dashboardStateQueryOptions);
    await ensureQueryDataSafe(context.queryClient, catalogQueryOptions());
    const dashboardState = context.queryClient.getQueryData<DashboardState>(
      DASHBOARD_STATE_QUERY_KEY
    );

    if (!dashboardState || dashboardState.unopenedChests <= 0) {
      return;
    }
  },
  component: ChestRoute,
});

function ChestRoute() {
  return <ChestPage />;
}

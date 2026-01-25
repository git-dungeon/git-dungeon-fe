import { createFileRoute } from "@tanstack/react-router";
import {
  dashboardStateQueryOptions,
  DASHBOARD_STATE_QUERY_KEY,
} from "@/entities/dashboard/model/dashboard-state-query";
import type { DashboardState } from "@/entities/dashboard/model/types";
import { levelUpSelectionQueryOptions } from "@/entities/level-up/model/level-up-query";
import { LevelUpPage } from "@/pages/level-up/ui/level-up-page";
import { ensureOnboardingComplete } from "@/shared/lib/navigation/ensure-onboarding-complete";
import { ensureQueryDataSafe } from "@/shared/lib/query/ensure-query-data-safe";

export const Route = createFileRoute("/level-up")({
  beforeLoad: async ({ context, location }) => {
    await context.auth.authorize({ location });
    await ensureOnboardingComplete(context.queryClient);
  },
  loader: async ({ context }) => {
    await context.auth.ensureSession();
    await ensureQueryDataSafe(context.queryClient, dashboardStateQueryOptions);
    const dashboardState = context.queryClient.getQueryData<DashboardState>(
      DASHBOARD_STATE_QUERY_KEY
    );

    if (dashboardState && dashboardState.levelUpPoints > 0) {
      await ensureQueryDataSafe(
        context.queryClient,
        levelUpSelectionQueryOptions
      );
    }
  },
  component: LevelUpRoute,
});

function LevelUpRoute() {
  return <LevelUpPage />;
}

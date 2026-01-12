import { createFileRoute } from "@tanstack/react-router";
import { dashboardStateQueryOptions } from "@/entities/dashboard/model/dashboard-state-query";
import { dungeonLogsQueryOptions } from "@/entities/dungeon-log/model/dungeon-logs-query";
import { DASHBOARD_RECENT_LOG_LIMIT } from "@/pages/dashboard/config/constants";
import { DashboardPage } from "@/pages/dashboard/ui/dashboard-page";
import { ensureOnboardingComplete } from "@/shared/lib/navigation/ensure-onboarding-complete";
import { ensureQueryDataSafe } from "@/shared/lib/query/ensure-query-data-safe";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ context, location }) => {
    await context.auth.authorize({ location });
    await ensureOnboardingComplete(context.queryClient);
  },
  loader: async ({ context }) => {
    await context.auth.ensureSession();
    await Promise.all([
      ensureQueryDataSafe(context.queryClient, dashboardStateQueryOptions),
      ensureQueryDataSafe(
        context.queryClient,
        dungeonLogsQueryOptions({ limit: DASHBOARD_RECENT_LOG_LIMIT })
      ),
    ]);
  },
  component: DashboardRoute,
});

function DashboardRoute() {
  return <DashboardPage />;
}

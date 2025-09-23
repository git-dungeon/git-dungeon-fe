import { createFileRoute } from "@tanstack/react-router";
import { dashboardStateQueryOptions } from "@/entities/dashboard/model/dashboard-state-query";
import { dungeonLogsQueryOptions } from "@/entities/dungeon-log/model/dungeon-logs-query";
import { DASHBOARD_RECENT_LOG_LIMIT } from "@/pages/dashboard/config/constants";
import { DashboardPage } from "@/pages/dashboard/ui/dashboard-page";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ context, location }) => context.auth.authorize({ location }),
  loader: async ({ context }) => {
    await context.auth.ensureSession();
    await Promise.all([
      context.queryClient.ensureQueryData(dashboardStateQueryOptions),
      context.queryClient.ensureQueryData(
        dungeonLogsQueryOptions({ limit: DASHBOARD_RECENT_LOG_LIMIT })
      ),
    ]);
  },
  component: DashboardRoute,
});

function DashboardRoute() {
  return <DashboardPage />;
}

import { DashboardSummary } from "@/widgets/dashboard-summary/ui/dashboard-summary";
import { DashboardActivity } from "@/widgets/dashboard-activity/ui/dashboard-activity";
import { DashboardEquipment } from "@/widgets/dashboard-equipment/ui/dashboard-equipment";
import { DashboardLogs } from "@/widgets/dashboard-logs/ui/dashboard-logs";
import { useDashboardState } from "@/entities/dashboard/model/use-dashboard-state";
import { useDungeonLogs } from "@/entities/dungeon-log/model/use-dungeon-logs";
import { DASHBOARD_RECENT_LOG_LIMIT } from "@/pages/dashboard/config/constants";

export function DashboardPage() {
  const { data: dashboardData } = useDashboardState();
  const { data: logsData } = useDungeonLogs({
    limit: DASHBOARD_RECENT_LOG_LIMIT,
  });

  if (!dashboardData) {
    return null;
  }

  const { state } = dashboardData;
  const logs = logsData?.logs ?? [];
  const latestLog = logs.at(0);

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-foreground text-2xl font-semibold">대시보드</h1>
        <p className="text-muted-foreground text-sm">
          캐릭터 진행 상황과 최근 탐험 로그를 한눈에 확인하세요.
        </p>
      </header>

      <DashboardSummary state={state} />

      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <DashboardActivity
          latestLog={latestLog}
          apRemaining={state.ap}
          currentAction={state.currentAction}
          lastActionCompletedAt={state.lastActionCompletedAt}
          nextActionStartAt={state.nextActionStartAt}
        />
        <DashboardEquipment
          weapon={state.equippedWeapon}
          armor={state.equippedArmor}
        />
      </section>

      <DashboardLogs logs={logs} />
    </section>
  );
}

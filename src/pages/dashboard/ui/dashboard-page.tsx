import { DashboardActivity } from "@/widgets/dashboard-activity/ui/dashboard-activity";
import { DashboardLogs } from "@/widgets/dashboard-logs/ui/dashboard-logs";
import { useDungeonLogs } from "@/entities/dungeon-log/model/use-dungeon-logs";
import { DASHBOARD_RECENT_LOG_LIMIT } from "@/pages/dashboard/config/constants";
import { DashboardEmbeddingBanner } from "@/widgets/dashboard-embedding/ui/dashboard-embedding-banner";
import { useCharacterOverview } from "@/features/character-summary/model/use-character-overview";

export function DashboardPage() {
  const overview = useCharacterOverview();
  const { data: logsData } = useDungeonLogs({
    limit: DASHBOARD_RECENT_LOG_LIMIT,
  });

  const state = overview.dashboard.data?.state;
  const character = overview.data;

  if (!state || !character) {
    return null;
  }

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

      <DashboardEmbeddingBanner
        level={character.level}
        exp={character.exp}
        expToLevel={character.expToLevel}
        gold={character.gold}
        floor={character.floor}
        stats={character.stats}
        equipment={character.equipment}
      />

      <div>
        <DashboardActivity
          latestLog={latestLog}
          apRemaining={character.stats.total.ap}
          currentAction={state.currentAction}
          lastActionCompletedAt={state.lastActionCompletedAt}
          nextActionStartAt={state.nextActionStartAt}
        />
      </div>

      <DashboardLogs logs={logs} />
    </section>
  );
}

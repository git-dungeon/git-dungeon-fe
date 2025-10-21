import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
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

  const state = overview.dashboard.data?.state ?? null;
  const character = overview.data;
  const showLoading = overview.isLoading && !character;
  const showError = overview.isError;

  const logs = logsData?.logs ?? [];
  const latestLog = logs.at(0);

  const renderSkeleton = () => (
    <Card className="border-dashed">
      <CardContent className="animate-pulse space-y-3 p-6">
        <div className="bg-muted h-5 w-1/3 rounded" />
        <div className="bg-muted h-3 w-2/3 rounded" />
        <div className="bg-muted h-24 rounded" />
      </CardContent>
    </Card>
  );

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-foreground text-2xl font-semibold">대시보드</h1>
        <p className="text-muted-foreground text-sm">
          캐릭터 진행 상황과 최근 탐험 로그를 한눈에 확인하세요.
        </p>
      </header>

      {showError ? (
        <Card className="border-destructive/30">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
            <span className="text-destructive">
              대시보드를 불러오는 중 문제가 발생했습니다.
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                void overview.refetch();
              }}
              className="text-xs"
            >
              다시 시도
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {showLoading ? renderSkeleton() : null}

      {!showLoading && character && state ? (
        <>
          <DashboardEmbeddingBanner
            level={character.level}
            exp={character.exp}
            expToLevel={character.expToLevel}
            gold={character.gold}
            ap={character.ap}
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
        </>
      ) : null}
    </section>
  );
}

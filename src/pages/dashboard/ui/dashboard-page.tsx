import { Button } from "@/shared/ui/button";
import { useDungeonLogs } from "@/entities/dungeon-log/model/use-dungeon-logs";
import { DASHBOARD_RECENT_LOG_LIMIT } from "@/pages/dashboard/config/constants";
import { useCharacterOverview } from "@/features/character-summary/model/use-character-overview";
import type { DungeonLogsFilterType } from "@/entities/dungeon-log/model/types";
import { useTranslation } from "react-i18next";
import { PixelPanel } from "@/shared/ui/pixel-panel";
import { DashboardSummaryPanel } from "@/widgets/dashboard-skin/ui/dashboard-summary-panel";
import { DashboardAttributesPanel } from "@/widgets/dashboard-skin/ui/dashboard-attributes-panel";
import { DashboardLogsPanel } from "@/widgets/dashboard-skin/ui/dashboard-logs-panel";
import { DashboardProgressPanel } from "@/widgets/dashboard-skin/ui/dashboard-progress-panel";

export function DashboardPage() {
  const { t } = useTranslation();
  const overview = useCharacterOverview();
  const { data: logsData } = useDungeonLogs({
    limit: DASHBOARD_RECENT_LOG_LIMIT,
    type: "EXPLORATION" satisfies DungeonLogsFilterType,
  });

  const state = overview.dashboard.data ?? null;
  const character = overview.data;
  const showLoading = overview.isLoading && !character;
  const showError = overview.isError;

  const logs = logsData?.logs ?? [];

  const renderSkeleton = () => (
    <PixelPanel className="border-dashed">
      <div className="animate-pulse space-y-3">
        <div className="bg-muted h-5 w-1/3 rounded" />
        <div className="bg-muted h-3 w-2/3 rounded" />
        <div className="bg-muted h-24 rounded" />
      </div>
    </PixelPanel>
  );

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1
          className="font-pixel-title text-lg sm:text-2xl"
          data-text={t("dashboard.title")}
        >
          {t("dashboard.title")}
        </h1>
        {/* <p className="text-muted-foreground text-sm">
          {t("dashboard.subtitle")}
        </p> */}
      </header>

      {showError ? (
        <PixelPanel className="border-destructive/40">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <span className="text-destructive">{t("dashboard.loadError")}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                void overview.refetch();
              }}
              className="text-xs"
            >
              {t("dashboard.retry")}
            </Button>
          </div>
        </PixelPanel>
      ) : null}

      {showLoading ? renderSkeleton() : null}

      {!showLoading && character && state ? (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1.2fr)]">
            <DashboardSummaryPanel
              level={character.level}
              hp={character.stats.total.hp}
              maxHp={character.stats.total.maxHp}
              ap={character.ap}
              exp={character.exp}
              expToLevel={character.expToLevel}
              gold={character.gold}
              equipment={character.equipment}
            />
            <DashboardAttributesPanel
              stats={character.stats}
              ap={character.ap}
            />
            <div className="lg:col-span-2 xl:col-span-1">
              <DashboardLogsPanel logs={logs} />
            </div>
          </div>
          <DashboardProgressPanel floor={character.floor} />
        </div>
      ) : null}
    </section>
  );
}

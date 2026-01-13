import { Button } from "@/shared/ui/button";
import { useDungeonLogs } from "@/entities/dungeon-log/model/use-dungeon-logs";
import {
  buildLogThumbnails,
  resolveActionThumbnail,
} from "@/entities/dungeon-log/config/thumbnails";
import { DASHBOARD_RECENT_LOG_LIMIT } from "@/pages/dashboard/config/constants";
import { useCharacterOverview } from "@/features/character-summary/model/use-character-overview";
import type { DungeonLogsFilterType } from "@/entities/dungeon-log/model/types";
import { useProfile } from "@/entities/profile/model/use-profile";
import { useCatalogItemNameResolver } from "@/entities/catalog/model/use-catalog-item-name";
import { useCatalogMonsterNameResolver } from "@/entities/catalog/model/use-catalog-monster-name";
import { useCatalogItemRarityResolver } from "@/entities/catalog/model/use-catalog-item-rarity";
import { useTranslation } from "react-i18next";
import { PixelErrorState, PixelSkeletonState } from "@/shared/ui/pixel-state";
import { DashboardSummaryPanel } from "@/widgets/dashboard-skin/ui/dashboard-summary-panel";
import { DashboardAttributesPanel } from "@/widgets/dashboard-skin/ui/dashboard-attributes-panel";
import { DashboardLogsPanel } from "@/widgets/dashboard-skin/ui/dashboard-logs-panel";
import { DashboardProgressPanel } from "@/widgets/dashboard-skin/ui/dashboard-progress-panel";

export function DashboardPage() {
  const { t } = useTranslation();
  const overview = useCharacterOverview();
  const profileQuery = useProfile();
  const resolveItemName = useCatalogItemNameResolver();
  const resolveMonsterName = useCatalogMonsterNameResolver();
  const resolveItemRarity = useCatalogItemRarityResolver();
  const { data: logsData } = useDungeonLogs({
    limit: DASHBOARD_RECENT_LOG_LIMIT,
    type: "EXPLORATION" satisfies DungeonLogsFilterType,
  });

  const state = overview.dashboard.data ?? null;
  const character = overview.data;
  const showLoading = overview.isLoading && !character;
  const showError = overview.isError;

  const logs = logsData?.logs ?? [];
  const latestLog = logs.at(0);
  const latestThumbnails = latestLog
    ? buildLogThumbnails(latestLog, {
        resolveItemName,
        resolveMonsterName,
        resolveItemRarity,
      })
    : [];
  const latestThumbnail = latestThumbnails.at(0);
  const progressThumbnail = latestThumbnail?.src
    ? latestThumbnail
    : latestLog
      ? {
          src: resolveActionThumbnail(latestLog.action),
          alt: t("dashboard.progress.monsterAlt"),
        }
      : undefined;

  const renderSkeleton = () => (
    <PixelSkeletonState
      className="border-dashed"
      titleWidth="w-1/3"
      lineWidths={["w-2/3", "w-full"]}
      count={1}
    />
  );

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1
          className="font-pixel-title pixel-page-title"
          data-text={t("dashboard.title")}
        >
          {t("dashboard.title")}
        </h1>
        {/* <p className="pixel-text-muted pixel-text-sm">
          {t("dashboard.subtitle")}
        </p> */}
      </header>

      {showError ? (
        <PixelErrorState
          className="border-destructive/40"
          message={t("dashboard.loadError")}
          actions={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                void overview.refetch();
              }}
              className="pixel-text-xs"
            >
              {t("dashboard.retry")}
            </Button>
          }
        />
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
              avatarUrl={profileQuery.data?.profile.avatarUrl}
            />
            <DashboardAttributesPanel
              stats={character.stats}
              ap={character.ap}
            />
            <div className="lg:col-span-2 xl:col-span-1">
              <DashboardLogsPanel logs={logs} />
            </div>
          </div>
          <DashboardProgressPanel
            floor={character.floor}
            thumbnail={progressThumbnail}
          />
        </div>
      ) : null}
    </section>
  );
}

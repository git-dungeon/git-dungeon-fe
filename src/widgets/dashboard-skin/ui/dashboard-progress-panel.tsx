import { MISSING_SPRITE } from "@/entities/catalog/config/local-sprites";
import { roundPercent } from "@/entities/dashboard/lib/progress";
import { PixelPanel } from "@/shared/ui/pixel-panel";
import { DashboardStatBar } from "@/widgets/dashboard-skin/ui/dashboard-stat-bar";
import { DashboardStatRow } from "@/widgets/dashboard-skin/ui/dashboard-stat-row";
import { useTranslation } from "react-i18next";

interface DashboardProgressPanelProps {
  floor: {
    current: number;
    best: number;
    progress: number;
  };
  thumbnail?: {
    src?: string;
    alt?: string;
  };
}

export function DashboardProgressPanel({
  floor,
  thumbnail,
}: DashboardProgressPanelProps) {
  const { t } = useTranslation();
  const progressValue = roundPercent(floor.progress);
  const thumbnailSrc = thumbnail?.src ?? MISSING_SPRITE;
  const thumbnailAlt = thumbnail?.alt ?? t("dashboard.progress.monsterAlt");

  return (
    <PixelPanel title={t("dashboard.panels.progress")}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1 space-y-3">
          <DashboardStatRow
            label={t("dashboard.progress.currentFloor")}
            value={t("dashboard.progress.currentFloorValue", {
              current: floor.current,
              best: floor.best,
            })}
            layout="inline"
            wrap
          />
          <DashboardStatBar
            label={t("dashboard.progress.completion")}
            value={`${progressValue}%`}
            percent={progressValue}
            tone="progress"
          />
        </div>
        <div className="pixel-avatar">
          <img
            src={thumbnailSrc}
            alt={thumbnailAlt}
            className="h-14 w-14 object-contain"
          />
        </div>
      </div>
    </PixelPanel>
  );
}

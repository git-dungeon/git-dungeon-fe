import { SummaryTile } from "@/shared/ui/summary-tile";
import { formatNumber } from "@/entities/dashboard/lib/formatters";
import { Progress } from "@/shared/ui/progress";
import { cn } from "@/shared/lib/utils";
import { useTranslation } from "react-i18next";

interface CharacterOverviewHeaderProps {
  level: number;
  exp: number;
  expToLevel: number;
  floor: {
    current: number;
    best: number;
    progress: number;
  };
  gold: number;
  ap: number;
  layoutMode?: "responsive" | "desktop";
}

export function CharacterOverviewHeader({
  level,
  exp,
  expToLevel,
  floor,
  gold,
  ap,
  layoutMode = "responsive",
}: CharacterOverviewHeaderProps) {
  const { t } = useTranslation();
  const expPercent = resolvePercent(exp, expToLevel);
  const floorPercent = resolvePercent(floor.progress, 100);
  const gridLayoutClass =
    layoutMode === "desktop" ? "grid-cols-4" : "lg:grid-cols-4";

  return (
    <div className={cn("grid gap-4", gridLayoutClass)}>
      <SummaryTile
        title={t("dashboard.summary.resources.level.title")}
        value={`Lv. ${level}`}
      >
        <p className="text-muted-foreground text-xs">
          {formatNumber(exp)} / {formatNumber(expToLevel)}
        </p>
        <Progress
          value={expPercent}
          aria-label={t("dashboard.summary.expProgressLabel")}
        />
      </SummaryTile>
      <SummaryTile
        title={t("dashboard.summary.floorProgress.title")}
        value={t("dashboard.summary.floorProgress.value", {
          current: floor.current,
          best: floor.best,
        })}
      >
        <p className="text-muted-foreground text-xs">
          {t("dashboard.summary.floorProgress.caption", {
            percent: floorPercent,
          })}
        </p>
        <Progress
          value={floorPercent}
          aria-label={t("dashboard.summary.floorProgress.aria")}
        />
      </SummaryTile>
      <SummaryTile
        title={t("dashboard.summary.gold.title")}
        value={`${formatNumber(gold)} G`}
      >
        <p className="text-muted-foreground text-xs">
          {t("dashboard.summary.gold.caption")}
        </p>
      </SummaryTile>
      <SummaryTile
        title={t("dashboard.summary.ap.title")}
        value={`${formatNumber(ap)}`}
      >
        <p className="text-muted-foreground text-xs">
          {t("dashboard.summary.ap.caption")}
        </p>
      </SummaryTile>
    </div>
  );
}

function resolvePercent(value: number, max: number): number {
  if (max <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round((value / max) * 100)));
}

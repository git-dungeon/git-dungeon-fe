import { MAX_FLOOR_PROGRESS_CHART } from "@/entities/dashboard/config/constants";
import { formatNumber } from "@/entities/dashboard/lib/formatters";
import {
  calcPercent,
  clampFloorProgress,
  getChartFloorProgress,
  getDisplayFloorProgress,
} from "@/entities/dashboard/lib/progress";
import type { DashboardState } from "@/entities/dashboard/model/types";
import { i18next } from "@/shared/i18n/i18n";

interface SummaryCardChart {
  current: number;
  max: number;
  color?: string;
  secondaryLabel?: string;
  valueLabel?: string;
}

interface SummaryCardViewModel {
  title: string;
  value: string;
  caption: string;
  chart?: SummaryCardChart;
}

interface SummarySectionsViewModel {
  combat: SummaryCardViewModel[];
  resources: SummaryCardViewModel[];
}

function formatFloorLabel(floor: number): string {
  return i18next.t("dashboard.summary.floorLabel", {
    floor: floor.toString().padStart(2, "0"),
  });
}

export function buildSummaryCards(
  state: DashboardState
): SummarySectionsViewModel {
  const maxFloorLabel = state.maxFloor ?? state.floor;
  const floorLabel = formatFloorLabel(state.floor);
  const maxFloorText = formatFloorLabel(maxFloorLabel);

  const progress = clampFloorProgress(state.floorProgress ?? 0);
  const displayProgress = getDisplayFloorProgress(progress);
  const chartProgress = getChartFloorProgress(progress);

  const hpPercent = calcPercent(state.hp, state.maxHp);
  const expToLevel = resolveExpToLevel(state);
  const expPercent = calcPercent(state.exp, expToLevel);

  const combat: SummaryCardViewModel[] = [
    {
      title: i18next.t("dashboard.summary.combat.floor.title"),
      value: `${floorLabel} / ${maxFloorText}`,
      caption: i18next.t("dashboard.summary.combat.floor.caption"),
    },
    {
      title: i18next.t("dashboard.summary.combat.hp.title"),
      value: `${state.hp} / ${state.maxHp}`,
      caption: i18next.t("dashboard.summary.combat.hp.caption"),
      chart: {
        current: state.hp,
        max: state.maxHp,
        color: "var(--color-chart-1)",
        secondaryLabel: `${Math.round(hpPercent)}%`,
      },
    },
    {
      title: i18next.t("dashboard.summary.combat.atk.title"),
      value: state.atk.toString(),
      caption: i18next.t("dashboard.summary.combat.atk.caption"),
    },
    {
      title: i18next.t("dashboard.summary.combat.def.title"),
      value: state.def.toString(),
      caption: i18next.t("dashboard.summary.combat.def.caption"),
    },
    {
      title: i18next.t("dashboard.summary.combat.luck.title"),
      value: state.luck.toString(),
      caption: i18next.t("dashboard.summary.combat.luck.caption"),
    },
  ];

  const resources: SummaryCardViewModel[] = [
    {
      title: i18next.t("dashboard.summary.resources.floorProgress.title"),
      value: `${Math.round(displayProgress)}%`,
      caption: i18next.t("dashboard.summary.resources.floorProgress.caption"),
      chart: {
        current: chartProgress,
        max: MAX_FLOOR_PROGRESS_CHART,
        color: "var(--color-chart-2)",
        secondaryLabel: i18next.t(
          "dashboard.summary.resources.floorProgress.secondaryLabel"
        ),
      },
    },
    {
      title: i18next.t("dashboard.summary.resources.gold.title"),
      value: formatNumber(state.gold),
      caption: i18next.t("dashboard.summary.resources.gold.caption"),
    },
    {
      title: i18next.t("dashboard.summary.resources.exp.title"),
      value: `${state.exp} / ${expToLevel}`,
      caption: i18next.t("dashboard.summary.resources.exp.caption"),
      chart: {
        current: state.exp,
        max: expToLevel,
        color: "var(--color-chart-3)",
        secondaryLabel: `${Math.round(expPercent)}%`,
      },
    },
    {
      title: i18next.t("dashboard.summary.resources.ap.title"),
      value: state.ap.toString(),
      caption: i18next.t("dashboard.summary.resources.ap.caption"),
    },
    {
      title: i18next.t("dashboard.summary.resources.level.title"),
      value: state.level.toString(),
      caption: i18next.t("dashboard.summary.resources.level.caption"),
    },
  ];

  return {
    combat,
    resources,
  };
}

function resolveExpToLevel(state: DashboardState): number {
  const expToLevel = state.expToLevel;
  if (typeof expToLevel === "number" && Number.isFinite(expToLevel)) {
    return Math.max(0, expToLevel);
  }

  return Math.max(0, state.level * 10);
}

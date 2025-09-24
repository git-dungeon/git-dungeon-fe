import { MAX_FLOOR_PROGRESS_CHART } from "@/entities/dashboard/config/constants";
import { formatNumber } from "@/entities/dashboard/lib/formatters";
import {
  calcPercent,
  clampFloorProgress,
  getChartFloorProgress,
  getDisplayFloorProgress,
} from "@/entities/dashboard/lib/progress";
import type { DashboardState } from "@/entities/dashboard/model/types";

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
  return `지하 ${floor.toString().padStart(2, "0")}층`;
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
  const expPercent = calcPercent(state.exp, state.expToLevel);

  const combat: SummaryCardViewModel[] = [
    {
      title: "현재 층 / 최고층",
      value: `${floorLabel} / ${maxFloorText}`,
      caption: "탐험 중인 층과 도달한 최고층",
    },
    {
      title: "HP",
      value: `${state.hp} / ${state.maxHp}`,
      caption: "현재 / 최대 체력",
      chart: {
        current: state.hp,
        max: state.maxHp,
        color: "var(--color-chart-1)",
        secondaryLabel: `${Math.round(hpPercent)}%`,
      },
    },
    {
      title: "ATK",
      value: state.atk.toString(),
      caption: "공격력",
    },
    {
      title: "DEF",
      value: state.def.toString(),
      caption: "방어력",
    },
    {
      title: "LUCK",
      value: state.luck.toString(),
      caption: "행운",
    },
  ];

  const resources: SummaryCardViewModel[] = [
    {
      title: "층 진행도",
      value: `${Math.round(displayProgress)}%`,
      caption: "100%가 되면 자동으로 다음 층으로 이동",
      chart: {
        current: chartProgress,
        max: MAX_FLOOR_PROGRESS_CHART,
        color: "var(--color-chart-2)",
        secondaryLabel: "진행 중",
      },
    },
    {
      title: "Gold",
      value: formatNumber(state.gold),
      caption: "보유 골드",
    },
    {
      title: "경험치",
      value: `${state.exp} / ${state.expToLevel}`,
      caption: "다음 레벨까지 필요 EXP",
      chart: {
        current: state.exp,
        max: state.expToLevel,
        color: "var(--color-chart-3)",
        secondaryLabel: `${Math.round(expPercent)}%`,
      },
    },
    {
      title: "남은 AP",
      value: state.ap.toString(),
      caption: "자동 탐험에 사용 가능한 AP",
    },
    {
      title: "레벨",
      value: state.level.toString(),
      caption: "현재 캐릭터 레벨",
    },
  ];

  return {
    combat,
    resources,
  };
}

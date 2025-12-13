import { useMemo } from "react";
import { isAfter, isValid, parseISO } from "date-fns";

import type { DashboardCurrentAction } from "@/entities/dashboard/model/types";
import type { DungeonLogEntry } from "@/entities/dungeon-log/model/types";
import {
  buildLogDescription,
  resolveActionLabel,
  resolveStatusLabel,
} from "@/entities/dungeon-log/lib/formatters";
import { formatDateTime } from "@/shared/lib/datetime/formatters";

export interface DashboardActivityViewParams {
  latestLog?: DungeonLogEntry;
  apRemaining: number;
  currentAction?: DashboardCurrentAction;
  currentActionStartedAt?: string | null;
  lastActionCompletedAt?: string;
  nextActionStartAt?: string;
}

export interface DashboardActivityViewModel {
  title: string;
  message: string;
  meta?: string;
  timestampLabel: string;
}

export function useDashboardActivityView(
  params: DashboardActivityViewParams
): DashboardActivityViewModel {
  const {
    latestLog,
    apRemaining,
    currentAction,
    currentActionStartedAt,
    lastActionCompletedAt,
    nextActionStartAt,
  } = params;

  return useMemo(() => {
    const isCurrentActionActive =
      Boolean(currentAction) && currentAction !== "IDLE";
    const latestStartedLog =
      latestLog?.status === "started" ? latestLog : undefined;
    const latestCompletedLog =
      latestLog?.status === "completed" ? latestLog : undefined;
    const parsedNextActionStart = parseIso(nextActionStartAt);
    const isNextActionDue = parsedNextActionStart
      ? !isAfter(parsedNextActionStart, new Date())
      : false;
    const isIdle = !isCurrentActionActive && apRemaining > 0 && isNextActionDue;
    const hasLogs = Boolean(latestLog);
    const hasCompletedHistory = Boolean(
      latestCompletedLog || lastActionCompletedAt
    );

    if (apRemaining <= 0) {
      return {
        title: "탐험 일시 중지",
        message: "남은 AP가 없어 탐험이 중단되었습니다.",
        meta:
          hasCompletedHistory && lastActionCompletedAt
            ? `마지막 행동 완료 ${formatDateTime(lastActionCompletedAt)}`
            : undefined,
        timestampLabel: "AP 부족",
      } satisfies DashboardActivityViewModel;
    }

    if (isCurrentActionActive && latestStartedLog) {
      return {
        title: resolveActionLabel(latestStartedLog.action),
        message: buildLogDescription(latestStartedLog),
        meta: `${latestStartedLog.floor}층 · ${resolveStatusLabel(
          latestStartedLog.status,
          latestStartedLog.action
        )}`,
        timestampLabel: formatDateTime(
          currentActionStartedAt ?? latestStartedLog.createdAt
        ),
      } satisfies DashboardActivityViewModel;
    }

    if (isCurrentActionActive && currentAction) {
      const mapped = mapDashboardActionToDungeonAction(currentAction);
      return {
        title: mapped ? resolveActionLabel(mapped) : "탐험 중 …",
        message: "현재 행동을 수행 중입니다. 잠시 후 결과를 확인하세요.",
        meta:
          currentActionStartedAt && isValid(parseISO(currentActionStartedAt))
            ? `시작 ${formatDateTime(currentActionStartedAt)}`
            : undefined,
        timestampLabel: currentActionStartedAt
          ? formatDateTime(currentActionStartedAt)
          : "진행 중",
      } satisfies DashboardActivityViewModel;
    }

    if (isIdle) {
      return {
        title: "탐험 중 …",
        message: "남은 AP를 사용해 곧 다음 행동을 실행합니다.",
        meta: parsedNextActionStart
          ? `다음 행동 예정 ${formatDateTime(nextActionStartAt!)}`
          : `남은 AP ${apRemaining}`,
        timestampLabel: "대기 중",
      } satisfies DashboardActivityViewModel;
    }

    if (hasLogs && latestLog) {
      return {
        title: resolveActionLabel(latestLog.action),
        message: buildLogDescription(latestLog),
        meta: `${latestLog.floor}층 · ${resolveStatusLabel(
          latestLog.status,
          latestLog.action
        )}`,
        timestampLabel: formatDateTime(latestLog.createdAt),
      } satisfies DashboardActivityViewModel;
    }

    return {
      title: "활동 내역",
      message: "최근 탐험 로그가 아직 없습니다.",
      meta: undefined,
      timestampLabel: "로그 없음",
    } satisfies DashboardActivityViewModel;
  }, [
    apRemaining,
    currentAction,
    currentActionStartedAt,
    lastActionCompletedAt,
    latestLog,
    nextActionStartAt,
  ]);
}

function mapDashboardActionToDungeonAction(
  action: DashboardCurrentAction
): DungeonLogEntry["action"] | null {
  switch (action) {
    case "BATTLE":
      return "battle";
    case "REST":
      return "rest";
    case "TREASURE":
      return "treasure";
    case "TRAP":
      return "trap";
    case "EXPLORING":
      return "move";
    case "IDLE":
    default:
      return null;
  }
}

function parseIso(iso?: string): Date | undefined {
  if (!iso) {
    return undefined;
  }

  const parsed = parseISO(iso);
  if (!isValid(parsed)) {
    return undefined;
  }

  return parsed;
}

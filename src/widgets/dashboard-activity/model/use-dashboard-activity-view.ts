import { useMemo } from "react";
import { isAfter, isValid, parseISO } from "date-fns";

import type { CurrentAction } from "@/entities/dashboard/model/types";
import type { DungeonLogEntry } from "@/entities/dungeon-log/model/types";
import {
  buildLogDescription,
  formatRelativeTime,
  resolveActionLabel,
  resolveStatusLabel,
} from "@/entities/dungeon-log/lib/formatters";

export interface DashboardActivityViewParams {
  latestLog?: DungeonLogEntry;
  apRemaining: number;
  currentAction?: CurrentAction;
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
    lastActionCompletedAt,
    nextActionStartAt,
  } = params;

  return useMemo(() => {
    const isCurrentActionActive = Boolean(currentAction);
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
            ? `마지막 행동 완료 ${formatRelativeTime(lastActionCompletedAt)}`
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
        timestampLabel: formatRelativeTime(
          currentAction?.startedAt ?? latestStartedLog.timestamp
        ),
      } satisfies DashboardActivityViewModel;
    }

    if (isIdle) {
      return {
        title: "탐험 중 …",
        message: "남은 AP를 사용해 곧 다음 행동을 실행합니다.",
        meta: parsedNextActionStart
          ? `다음 행동 예정 ${formatRelativeTime(nextActionStartAt!)}`
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
        timestampLabel: formatRelativeTime(latestLog.timestamp),
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
    lastActionCompletedAt,
    latestLog,
    nextActionStartAt,
  ]);
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

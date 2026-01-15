import { useMemo } from "react";
import { isAfter, isValid, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";

import type { DashboardCurrentAction } from "@/entities/dashboard/model/types";
import type { DungeonLogEntry } from "@/entities/dungeon-log/model/types";
import {
  buildLogDescription,
  resolveActionLabel,
  resolveStatusLabel,
} from "@/entities/dungeon-log/lib/formatters";
import { formatDateTime } from "@/shared/lib/datetime/formatters";
import { useCatalogMonsterNameResolver } from "@/entities/catalog/model/use-catalog-monster-name";

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
  const { t } = useTranslation();
  const resolveMonsterName = useCatalogMonsterNameResolver();
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
      latestLog?.status === "STARTED" ? latestLog : undefined;
    const latestCompletedLog =
      latestLog?.status === "COMPLETED" ? latestLog : undefined;
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
        title: t("dashboard.activity.paused.title"),
        message: t("dashboard.activity.paused.message"),
        meta:
          hasCompletedHistory && lastActionCompletedAt
            ? t("dashboard.activity.paused.meta", {
                time: formatDateTime(lastActionCompletedAt),
              })
            : undefined,
        timestampLabel: t("dashboard.activity.paused.timestamp"),
      } satisfies DashboardActivityViewModel;
    }

    if (isCurrentActionActive && latestStartedLog) {
      return {
        title: resolveActionLabel(latestStartedLog.action),
        message: buildLogDescription(latestStartedLog, {
          resolveMonsterName,
        }),
        meta: `${formatFloorLabel(t, latestStartedLog.floor)} · ${resolveStatusLabel(
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
        title: mapped
          ? resolveActionLabel(mapped)
          : t("dashboard.activity.inProgress.title"),
        message: t("dashboard.activity.inProgress.message"),
        meta:
          currentActionStartedAt && isValid(parseISO(currentActionStartedAt))
            ? t("dashboard.activity.inProgress.meta", {
                time: formatDateTime(currentActionStartedAt),
              })
            : undefined,
        timestampLabel: currentActionStartedAt
          ? formatDateTime(currentActionStartedAt)
          : t("dashboard.activity.inProgress.timestamp"),
      } satisfies DashboardActivityViewModel;
    }

    if (isIdle) {
      return {
        title: t("dashboard.activity.idle.title"),
        message: t("dashboard.activity.idle.message"),
        meta: parsedNextActionStart
          ? t("dashboard.activity.idle.metaNext", {
              time: formatDateTime(nextActionStartAt!),
            })
          : t("dashboard.activity.idle.metaAp", { ap: apRemaining }),
        timestampLabel: t("dashboard.activity.idle.timestamp"),
      } satisfies DashboardActivityViewModel;
    }

    if (hasLogs && latestLog) {
      return {
        title: resolveActionLabel(latestLog.action),
        message: buildLogDescription(latestLog, {
          resolveMonsterName,
        }),
        meta: `${formatFloorLabel(t, latestLog.floor)} · ${resolveStatusLabel(
          latestLog.status,
          latestLog.action
        )}`,
        timestampLabel: formatDateTime(latestLog.createdAt),
      } satisfies DashboardActivityViewModel;
    }

    return {
      title: t("dashboard.activity.empty.title"),
      message: t("dashboard.activity.empty.message"),
      meta: undefined,
      timestampLabel: t("dashboard.activity.empty.timestamp"),
    } satisfies DashboardActivityViewModel;
  }, [
    t,
    apRemaining,
    currentAction,
    currentActionStartedAt,
    lastActionCompletedAt,
    latestLog,
    nextActionStartAt,
    resolveMonsterName,
  ]);
}

function formatFloorLabel(
  t: (key: string, options?: Record<string, unknown>) => string,
  floor?: number | null
) {
  return typeof floor === "number"
    ? t("logs.floor", { floor })
    : t("common.placeholder");
}

function mapDashboardActionToDungeonAction(
  action: DashboardCurrentAction
): DungeonLogEntry["action"] | null {
  switch (action) {
    case "BATTLE":
      return "BATTLE";
    case "REST":
      return "REST";
    case "TREASURE":
      return "TREASURE";
    case "TRAP":
      return "TRAP";
    case "EMPTY":
      return "EMPTY";
    case "EXPLORING":
      return "MOVE";
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

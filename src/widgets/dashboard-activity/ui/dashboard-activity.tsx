import { isAfter, isValid, parseISO } from "date-fns";
import type { CurrentAction } from "@/entities/dashboard/model/types";
import type { DungeonLogEntry } from "@/entities/dungeon-log/model/types";
import {
  buildLogDescription,
  formatRelativeTime,
  resolveActionLabel,
  resolveStatusLabel,
} from "@/entities/dungeon-log/lib/formatters";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card/card";

interface DashboardActivityProps {
  latestLog?: DungeonLogEntry;
  apRemaining: number;
  currentAction?: CurrentAction;
  lastActionCompletedAt?: string;
  nextActionStartAt?: string;
}

export function DashboardActivity({
  latestLog,
  apRemaining,
  currentAction,
  lastActionCompletedAt,
  nextActionStartAt,
}: DashboardActivityProps) {
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

  let title: string;
  let message: string;
  let meta: string | undefined;
  let timestampLabel: string;

  if (isCurrentActionActive && latestStartedLog) {
    title = resolveActionLabel(latestStartedLog.action);
    message = buildLogDescription(latestStartedLog);
    meta = `${latestStartedLog.floor}층 · ${resolveStatusLabel(
      latestStartedLog.status,
      latestStartedLog.action
    )}`;
    timestampLabel = formatRelativeTime(
      currentAction?.startedAt ?? latestStartedLog.timestamp
    );
  } else if (isIdle) {
    title = "탐험 중 …";
    message = "남은 AP를 사용해 곧 다음 행동을 실행합니다.";
    meta = parsedNextActionStart
      ? `다음 행동 예정 ${formatRelativeTime(nextActionStartAt!)}`
      : `남은 AP ${apRemaining}`;
    timestampLabel = "대기 중";
  } else if (hasLogs) {
    title = resolveActionLabel(latestLog!.action);
    message = buildLogDescription(latestLog!);
    meta = `${latestLog!.floor}층 · ${resolveStatusLabel(
      latestLog!.status,
      latestLog!.action
    )}`;
    timestampLabel = formatRelativeTime(latestLog!.timestamp);
  } else if (apRemaining <= 0) {
    title = "탐험 일시 중지";
    message = "남은 AP가 없어 탐험이 중단되었습니다.";
    meta =
      hasCompletedHistory && lastActionCompletedAt
        ? `마지막 행동 완료 ${formatRelativeTime(lastActionCompletedAt)}`
        : undefined;
    timestampLabel = "AP 부족";
  } else {
    title = "활동 내역";
    message = "최근 탐험 로그가 아직 없습니다.";
    meta = undefined;
    timestampLabel = "로그 없음";
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5">
        <CardTitle className="text-lg">최근 활동</CardTitle>
        <span className="text-muted-foreground text-xs">{timestampLabel}</span>
      </CardHeader>
      <CardContent className="space-y-1 p-5 pt-0 text-sm">
        <p className="text-foreground font-medium">{title}</p>
        <p className="text-muted-foreground">{message}</p>
        {meta ? <p className="text-muted-foreground text-xs">{meta}</p> : null}
      </CardContent>
    </Card>
  );
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

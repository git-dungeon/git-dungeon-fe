import { RefreshCw, Loader2 } from "lucide-react";
import {
  formatDateTime,
  formatRelativeTime,
} from "@/shared/lib/datetime/formatters";
import { Button } from "@/shared/ui/button";
import { ApiError } from "@/shared/api/http-client";
import type { ProfileConnections } from "@/entities/profile/model/types";
import { useGithubSyncStatus } from "@/entities/github/model/use-github-sync-status";
import { useGithubSync } from "@/features/settings/model/use-github-sync";

interface GithubConnectionProps {
  connections: ProfileConnections;
}

export function GithubConnection({ connections }: GithubConnectionProps) {
  const github = connections.github;
  const isConnected = github?.connected ?? false;
  const githubSync = useGithubSync();
  const statusQuery = useGithubSyncStatus();

  const status = statusQuery.data ?? null;
  const resolvedConnected = status?.connected ?? isConnected;

  const lastSyncLabel = resolveLastSyncLabel({
    connected: resolvedConnected,
    lastSyncAt: status?.lastSyncAt ?? github?.lastSyncAt ?? null,
  });
  const nextSyncLabel = resolveNextSyncLabel(status);
  const isStatusLoading = resolvedConnected && statusQuery.isLoading;
  const isSyncAllowed = status ? status.allowed : true;
  const isSyncDisabled =
    githubSync.isPending || isStatusLoading || !isSyncAllowed;
  const syncErrorMessage = resolveGithubSyncErrorMessage(githubSync.error);

  return (
    <div className="flex w-full flex-col items-start gap-3">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-foreground text-sm font-semibold">GitHub 연동</p>
          <p
            className="text-muted-foreground text-xs"
            title={lastSyncLabel?.title}
          >
            {lastSyncLabel?.text ??
              (resolvedConnected
                ? "최근 동기화 정보를 불러올 수 없습니다."
                : "계정을 연동하면 커밋 통계가 표시됩니다.")}
          </p>
          {nextSyncLabel ? (
            <p className="text-muted-foreground text-xs">
              <span title={nextSyncLabel.title}>{nextSyncLabel.text}</span>
            </p>
          ) : null}
          {isStatusLoading ? (
            <p className="text-muted-foreground text-xs">
              동기화 가능 여부 확인 중...
            </p>
          ) : null}
          {syncErrorMessage ? (
            <p role="alert" className="text-destructive text-xs">
              {syncErrorMessage}
            </p>
          ) : null}
        </div>
        {resolvedConnected ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-2"
            disabled={isSyncDisabled}
            onClick={() => {
              void githubSync.mutateAsync().catch(() => {
                // error is surfaced via githubSync.error
              });
            }}
          >
            {githubSync.isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <RefreshCw className="size-4" aria-hidden />
            )}
            새로고침
          </Button>
        ) : (
          <span className="border-border text-muted-foreground rounded-md border px-2 py-1 text-xs">
            미연결
          </span>
        )}
      </div>
    </div>
  );
}

function resolveLastSyncLabel(github?: {
  connected: boolean;
  lastSyncAt?: string | null;
}): { text: string; title?: string } | null {
  if (!github?.connected) {
    return null;
  }

  const lastSyncAt = github.lastSyncAt;
  if (!lastSyncAt) {
    return { text: "마지막 동기화 정보 없음" };
  }

  const relative = formatRelativeTime(lastSyncAt);
  const absolute = formatDateTime(lastSyncAt);
  return {
    text: `마지막 동기화 ${relative}`,
    title: absolute,
  };
}

function resolveNextSyncLabel(
  status?: {
    connected: boolean;
    allowed: boolean;
    nextAvailableAt: string | null;
    retryAfterMs: number | null;
  } | null
): { text: string; title?: string } | null {
  if (!status?.connected) {
    return null;
  }

  if (status.allowed) {
    return { text: "지금 새로고침 가능" };
  }

  const nextAvailableAt =
    status.nextAvailableAt ??
    (typeof status.retryAfterMs === "number" && status.retryAfterMs > 0
      ? new Date(Date.now() + status.retryAfterMs).toISOString()
      : null);

  if (!nextAvailableAt) {
    return { text: "아직 새로고침할 수 없습니다." };
  }

  const relative = formatRelativeTime(nextAvailableAt);
  const absolute = formatDateTime(nextAvailableAt);
  return {
    text: `다음 새로고침 가능 ${relative} (${absolute})`,
    title: absolute,
  };
}

function resolveGithubSyncErrorMessage(error: unknown): string | null {
  if (!(error instanceof ApiError)) {
    return null;
  }

  if (error.status === 400) {
    return "GitHub 계정이 연동되어 있지 않습니다.";
  }

  if (error.status === 401 || error.status === 403) {
    return "세션이 만료되었습니다. 다시 로그인해 주세요.";
  }

  if (error.status === 429) {
    return "요청 한도에 도달했습니다. 잠시 후 다시 시도해 주세요.";
  }

  if (error.status === 409) {
    return "현재 동기화를 진행할 수 없습니다. 잠시 후 다시 시도해 주세요.";
  }

  const payload = error.payload as { error?: { message?: unknown } } | null;
  const payloadMessage =
    payload &&
    typeof payload === "object" &&
    typeof payload.error?.message === "string"
      ? payload.error.message
      : null;

  return payloadMessage ?? "GitHub 동기화에 실패했습니다.";
}

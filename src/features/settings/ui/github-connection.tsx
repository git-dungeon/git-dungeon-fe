import { RefreshCw, Loader2 } from "lucide-react";
import {
  formatDateTime,
  formatRelativeTime,
} from "@/shared/lib/datetime/formatters";
import { PixelButton } from "@/shared/ui/pixel-button";
import { ApiError } from "@/shared/api/http-client";
import type { ProfileConnections } from "@/entities/profile/model/types";
import { useGithubSyncStatus } from "@/entities/github/model/use-github-sync-status";
import { useGithubSync } from "@/features/settings/model/use-github-sync";
import { useTranslation } from "react-i18next";

interface GithubConnectionProps {
  connections: ProfileConnections;
}

export function GithubConnection({ connections }: GithubConnectionProps) {
  const { t } = useTranslation();
  const github = connections.github;
  const isConnected = github?.connected ?? false;
  const githubSync = useGithubSync();
  const statusQuery = useGithubSyncStatus();

  const status = statusQuery.data ?? null;
  const resolvedConnected = status?.connected ?? isConnected;

  const lastSyncLabel = resolveLastSyncLabel(t, {
    connected: resolvedConnected,
    lastSyncAt: status?.lastSyncAt ?? github?.lastSyncAt ?? null,
  });
  const nextSyncLabel = resolveNextSyncLabel(t, status);
  const isStatusLoading = resolvedConnected && statusQuery.isLoading;
  const isSyncAllowed = status ? status.allowed : true;
  const isSyncDisabled =
    githubSync.isPending || isStatusLoading || !isSyncAllowed;
  const syncErrorMessage = resolveGithubSyncErrorMessage(t, githubSync.error);

  return (
    <div className="flex w-full flex-col items-start gap-3">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-foreground text-sm font-semibold">
            {t("settings.github.title")}
          </p>
          <p
            className="text-muted-foreground text-xs"
            title={lastSyncLabel?.title}
          >
            {lastSyncLabel?.text ??
              (resolvedConnected
                ? t("settings.github.status.lastSyncUnavailable")
                : t("settings.github.status.connectHint"))}
          </p>
          {nextSyncLabel ? (
            <p className="text-muted-foreground text-xs">
              <span title={nextSyncLabel.title}>{nextSyncLabel.text}</span>
            </p>
          ) : null}
          {isStatusLoading ? (
            <p className="text-muted-foreground text-xs">
              {t("settings.github.status.checking")}
            </p>
          ) : null}
          {syncErrorMessage ? (
            <p role="alert" className="text-destructive text-xs">
              {syncErrorMessage}
            </p>
          ) : null}
        </div>
        {resolvedConnected ? (
          <PixelButton
            type="button"
            className="gap-2"
            pixelSize="compact"
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
            {t("settings.github.refresh")}
          </PixelButton>
        ) : (
          <span className="border-border text-muted-foreground rounded-md border px-2 py-1 text-xs">
            {t("settings.github.status.disconnected")}
          </span>
        )}
      </div>
    </div>
  );
}

function resolveLastSyncLabel(
  t: (key: string, options?: Record<string, unknown>) => string,
  github?: {
    connected: boolean;
    lastSyncAt?: string | null;
  }
): { text: string; title?: string } | null {
  if (!github?.connected) {
    return null;
  }

  const lastSyncAt = github.lastSyncAt;
  if (!lastSyncAt) {
    return { text: t("settings.github.status.lastSyncMissing") };
  }

  const relative = formatRelativeTime(lastSyncAt);
  const absolute = formatDateTime(lastSyncAt);
  return {
    text: t("settings.github.status.lastSync", { relative }),
    title: absolute,
  };
}

function resolveNextSyncLabel(
  t: (key: string, options?: Record<string, unknown>) => string,
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
    return { text: t("settings.github.status.syncAllowed") };
  }

  const nextAvailableAt =
    status.nextAvailableAt ??
    (typeof status.retryAfterMs === "number" && status.retryAfterMs > 0
      ? new Date(Date.now() + status.retryAfterMs).toISOString()
      : null);

  if (!nextAvailableAt) {
    return { text: t("settings.github.status.syncNotAvailable") };
  }

  const relative = formatRelativeTime(nextAvailableAt);
  const absolute = formatDateTime(nextAvailableAt);
  return {
    text: t("settings.github.status.nextSync", { relative, absolute }),
    title: absolute,
  };
}

function resolveGithubSyncErrorMessage(
  t: (key: string) => string,
  error: unknown
): string | null {
  if (!(error instanceof ApiError)) {
    return null;
  }

  if (error.status === 400) {
    return t("settings.github.errors.notConnected");
  }

  if (error.status === 401 || error.status === 403) {
    return t("settings.github.errors.sessionExpired");
  }

  if (error.status === 429) {
    return t("settings.github.errors.rateLimited");
  }

  if (error.status === 409) {
    return t("settings.github.errors.conflict");
  }

  const payload = error.payload as { error?: { message?: unknown } } | null;
  const payloadMessage =
    payload &&
    typeof payload === "object" &&
    typeof payload.error?.message === "string"
      ? payload.error.message
      : null;

  return payloadMessage ?? t("settings.github.errors.unknown");
}

import { useState } from "react";
import type { LogEntry, LogsFilterType } from "@/entities/logs/model/types";
import { DeltaList } from "@/entities/logs/ui/delta-list";
import { LogCard } from "@/entities/logs/ui/log-card";
import { LogThumbnailStack } from "@/entities/logs/ui/log-thumbnail-stack";
import { PixelButton } from "@/shared/ui/pixel-button";
import { PixelIcon } from "@/shared/ui/pixel-icon";
import {
  PixelEmptyState,
  PixelErrorState,
  PixelSkeletonState,
} from "@/shared/ui/pixel-state";
import { useLogsTimeline } from "@/widgets/logs/timeline/model/use-logs-timeline";
import { buildLogThumbnails } from "@/entities/logs/config/thumbnails";
import { LogsDetailDialog } from "@/widgets/logs/timeline/ui/detail-dialog";
import { useTranslation } from "react-i18next";
import { useCatalogItemNameResolver } from "@/entities/catalog/model/use-catalog-item-name";
import { useCatalogMonsterNameResolver } from "@/entities/catalog/model/use-catalog-monster-name";
import { useCatalogItemRarityResolver } from "@/entities/catalog/model/use-catalog-item-rarity";
import { normalizeError } from "@/shared/errors/normalize-error";
import { getErrorMessageKey } from "@/shared/errors/error-message";
import { isAppError } from "@/shared/errors/app-error";

export interface LogsTimelineProps {
  filterType?: LogsFilterType;
  from?: string;
  to?: string;
  onResetFilter?: () => void;
}

export function LogsTimeline({
  filterType,
  from,
  to,
  onResetFilter,
}: LogsTimelineProps) {
  const { t } = useTranslation();
  const {
    logs,
    status,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useLogsTimeline({ filterType, from, to });
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const resolveItemName = useCatalogItemNameResolver();
  const resolveMonsterName = useCatalogMonsterNameResolver();
  const resolveItemRarity = useCatalogItemRarityResolver();

  if (status === "pending") {
    return <LoadingState />;
  }

  if (status === "error") {
    const appError = normalizeError(error);
    const apiErrorCode = (
      appError.meta?.payload as { error?: { code?: string } } | undefined
    )?.error?.code;

    return (
      <ErrorState
        t={t}
        onRetry={refetch}
        error={appError}
        showInvalidQueryHint={apiErrorCode === "LOGS_INVALID_QUERY"}
        onResetFilter={onResetFilter}
      />
    );
  }

  if (logs.length === 0) {
    return <EmptyState t={t} />;
  }

  const isRefreshing = isFetching || isFetchingNextPage;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <PixelButton
          onClick={() => refetch()}
          disabled={isRefreshing}
          data-testid="logs-refresh-button"
          className="flex items-center gap-2"
        >
          <PixelIcon name="refresh" size={14} />
          {isRefreshing
            ? t("logs.timeline.refreshing")
            : t("logs.timeline.refresh")}
        </PixelButton>
      </div>
      <ul className="pixel-log-list">
        {logs.map((log) => {
          const thumbnails = buildLogThumbnails(log, {
            resolveItemName,
            resolveMonsterName,
            resolveItemRarity,
          });
          return (
            <li key={log.id}>
              <LogCard
                log={log}
                renderDelta={(entry) => <DeltaList entry={entry} />}
                renderThumbnail={() => (
                  <LogThumbnailStack thumbnails={thumbnails} />
                )}
                onClick={() => setSelectedLog(log)}
              />
            </li>
          );
        })}
      </ul>
      <div className="flex justify-center py-6">
        {isFetchingNextPage ? (
          <span className="pixel-text-muted text-sm">
            {t("logs.timeline.loadingNext")}
          </span>
        ) : hasNextPage ? (
          <PixelButton onClick={() => fetchNextPage()}>
            {t("logs.timeline.loadMore")}
          </PixelButton>
        ) : (
          <span className="pixel-text-muted text-sm">
            {t("logs.timeline.allLoaded")}
          </span>
        )}
      </div>
      <LogsDetailDialog
        log={selectedLog}
        open={Boolean(selectedLog)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedLog(null);
          }
        }}
      />
    </div>
  );
}

function LoadingState() {
  return <PixelSkeletonState />;
}

interface ErrorStateProps {
  t: (key: string) => string;
  error: unknown;
  onRetry: () => void;
  showInvalidQueryHint?: boolean;
  onResetFilter?: () => void;
}

function ErrorState({
  t,
  error,
  onRetry,
  showInvalidQueryHint,
  onResetFilter,
}: ErrorStateProps) {
  const message = isAppError(error)
    ? t(getErrorMessageKey(error.code))
    : error instanceof Error
      ? error.message
      : undefined;

  return (
    <PixelErrorState
      message={t("logs.timeline.error")}
      actions={
        <>
          {showInvalidQueryHint && onResetFilter ? (
            <PixelButton onClick={onResetFilter} className="mr-2">
              {t("logs.timeline.resetFilter")}
            </PixelButton>
          ) : null}
          <PixelButton onClick={onRetry}>
            {t("logs.timeline.retry")}
          </PixelButton>
        </>
      }
    >
      {showInvalidQueryHint ? (
        <p className="pixel-text-muted text-xs">
          {t("logs.timeline.invalidFilter")}
        </p>
      ) : null}
      {message ? <p className="pixel-text-muted text-xs">{message}</p> : null}
    </PixelErrorState>
  );
}

function EmptyState({ t }: { t: (key: string) => string }) {
  return <PixelEmptyState message={t("logs.timeline.empty")} />;
}

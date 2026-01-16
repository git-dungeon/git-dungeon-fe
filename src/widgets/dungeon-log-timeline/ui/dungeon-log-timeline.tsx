import { useState } from "react";
import type {
  DungeonLogEntry,
  DungeonLogsFilterType,
} from "@/entities/dungeon-log/model/types";
import { DeltaList } from "@/entities/dungeon-log/ui/delta-list";
import { LogCard } from "@/entities/dungeon-log/ui/log-card";
import { LogThumbnailStack } from "@/entities/dungeon-log/ui/log-thumbnail-stack";
import { PixelButton } from "@/shared/ui/pixel-button";
import {
  PixelEmptyState,
  PixelErrorState,
  PixelSkeletonState,
} from "@/shared/ui/pixel-state";
import { useDungeonLogTimeline } from "@/widgets/dungeon-log-timeline/model/use-dungeon-log-timeline";
import { buildLogThumbnails } from "@/entities/dungeon-log/config/thumbnails";
import { DungeonLogDetailDialog } from "@/widgets/dungeon-log-timeline/ui/dungeon-log-detail-dialog";
import { useTranslation } from "react-i18next";
import { useCatalogItemNameResolver } from "@/entities/catalog/model/use-catalog-item-name";
import { useCatalogMonsterNameResolver } from "@/entities/catalog/model/use-catalog-monster-name";
import { useCatalogItemRarityResolver } from "@/entities/catalog/model/use-catalog-item-rarity";
import { normalizeError } from "@/shared/errors/normalize-error";
import { getErrorMessageKey } from "@/shared/errors/error-message";
import { isAppError } from "@/shared/errors/app-error";

interface DungeonLogTimelineProps {
  filterType?: DungeonLogsFilterType;
  onResetFilter?: () => void;
}

export function DungeonLogTimeline({
  filterType,
  onResetFilter,
}: DungeonLogTimelineProps) {
  const { t } = useTranslation();
  const {
    logs,
    status,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    sentinelRef,
  } = useDungeonLogTimeline({ filterType });
  const [selectedLog, setSelectedLog] = useState<DungeonLogEntry | null>(null);
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

  return (
    <div className="space-y-4">
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
      <div ref={sentinelRef} className="flex justify-center py-6">
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
      <DungeonLogDetailDialog
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

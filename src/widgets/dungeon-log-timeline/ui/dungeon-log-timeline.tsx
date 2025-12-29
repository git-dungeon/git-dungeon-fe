import { useState } from "react";
import type {
  DungeonLogEntry,
  DungeonLogsFilterType,
} from "@/entities/dungeon-log/model/types";
import { DeltaList } from "@/entities/dungeon-log/ui/delta-list";
import { LogCard } from "@/entities/dungeon-log/ui/log-card";
import { LogThumbnailStack } from "@/entities/dungeon-log/ui/log-thumbnail-stack";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { useDungeonLogTimeline } from "@/widgets/dungeon-log-timeline/model/use-dungeon-log-timeline";
import { buildLogThumbnails } from "@/entities/dungeon-log/config/thumbnails";
import { DungeonLogDetailDialog } from "@/widgets/dungeon-log-timeline/ui/dungeon-log-detail-dialog";
import { ApiError } from "@/shared/api/http-client";
import { useTranslation } from "react-i18next";
import { useCatalogItemNameResolver } from "@/entities/catalog/model/use-catalog-item-name";
import { useCatalogMonsterNameResolver } from "@/entities/catalog/model/use-catalog-monster-name";

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

  if (status === "pending") {
    return <LoadingState />;
  }

  if (status === "error") {
    const apiErrorCode =
      error instanceof ApiError
        ? (error.payload as { error?: { code?: string } } | undefined)?.error
            ?.code
        : undefined;

    return (
      <ErrorState
        t={t}
        onRetry={refetch}
        error={error}
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
      <ul className="space-y-3">
        {logs.map((log) => {
          const thumbnails = buildLogThumbnails(log, {
            resolveItemName,
            resolveMonsterName,
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
          <span className="text-muted-foreground text-sm">
            {t("logs.timeline.loadingNext")}
          </span>
        ) : hasNextPage ? (
          <Button variant="outline" onClick={() => fetchNextPage()}>
            {t("logs.timeline.loadMore")}
          </Button>
        ) : (
          <span className="text-muted-foreground text-sm">
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
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="border-border bg-card animate-pulse rounded-lg border p-6"
        >
          <div className="bg-muted h-4 w-24 rounded" />
          <div className="mt-4 space-y-2">
            <div className="bg-muted h-3 w-32 rounded" />
            <div className="bg-muted h-3 w-40 rounded" />
            <div className="bg-muted h-3 w-28 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
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
  const message = error instanceof Error ? error.message : undefined;

  return (
    <Card className="border-destructive/50">
      <CardContent className="flex flex-col gap-3 p-6 text-sm">
        <p className="text-destructive">{t("logs.timeline.error")}</p>
        {showInvalidQueryHint ? (
          <p className="text-muted-foreground text-xs">
            {t("logs.timeline.invalidFilter")}
          </p>
        ) : null}
        {message ? (
          <p className="text-muted-foreground text-xs">{message}</p>
        ) : null}
        <div>
          {showInvalidQueryHint && onResetFilter ? (
            <Button variant="outline" onClick={onResetFilter} className="mr-2">
              {t("logs.timeline.resetFilter")}
            </Button>
          ) : null}
          <Button variant="outline" onClick={onRetry}>
            {t("logs.timeline.retry")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ t }: { t: (key: string) => string }) {
  return (
    <Card className="border-dashed">
      <CardContent className="text-muted-foreground p-6 text-sm">
        {t("logs.timeline.empty")}
      </CardContent>
    </Card>
  );
}

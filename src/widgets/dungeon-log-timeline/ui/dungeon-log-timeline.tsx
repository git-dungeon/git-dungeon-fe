import { useState } from "react";
import type {
  DungeonLogCategory,
  DungeonLogEntry,
} from "@/entities/dungeon-log/model/types";
import { DeltaList } from "@/entities/dungeon-log/ui/delta-list";
import { LogCard } from "@/entities/dungeon-log/ui/log-card";
import { LogThumbnailStack } from "@/entities/dungeon-log/ui/log-thumbnail-stack";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { useDungeonLogTimeline } from "@/widgets/dungeon-log-timeline/model/use-dungeon-log-timeline";
import { buildLogThumbnails } from "@/entities/dungeon-log/config/thumbnails";
import { DungeonLogDetailDialog } from "@/widgets/dungeon-log-timeline/ui/dungeon-log-detail-dialog";

interface DungeonLogTimelineProps {
  category?: DungeonLogCategory;
}

export function DungeonLogTimeline({ category }: DungeonLogTimelineProps) {
  const {
    logs,
    status,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    sentinelRef,
  } = useDungeonLogTimeline({ category });
  const [selectedLog, setSelectedLog] = useState<DungeonLogEntry | null>(null);

  if (status === "pending") {
    return <LoadingState />;
  }

  if (status === "error") {
    return <ErrorState onRetry={refetch} error={error} />;
  }

  if (logs.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {logs.map((log) => {
          const thumbnails = buildLogThumbnails(log);
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
            다음 로그를 불러오는 중...
          </span>
        ) : hasNextPage ? (
          <Button variant="outline" onClick={() => fetchNextPage()}>
            더 불러오기
          </Button>
        ) : (
          <span className="text-muted-foreground text-sm">
            모든 로그를 확인했습니다.
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
  error: unknown;
  onRetry: () => void;
}

function ErrorState({ error, onRetry }: ErrorStateProps) {
  const message = error instanceof Error ? error.message : undefined;

  return (
    <Card className="border-destructive/50">
      <CardContent className="flex flex-col gap-3 p-6 text-sm">
        <p className="text-destructive">
          로그를 불러오는 중 문제가 발생했습니다.
        </p>
        {message ? (
          <p className="text-muted-foreground text-xs">{message}</p>
        ) : null}
        <div>
          <Button variant="outline" onClick={onRetry}>
            다시 시도
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="text-muted-foreground p-6 text-sm">
        아직 표시할 로그가 없습니다. 던전을 더 탐험하거나 장비를 조작해보세요.
      </CardContent>
    </Card>
  );
}

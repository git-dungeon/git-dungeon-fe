import type { ReactNode } from "react";
import type { DungeonLogEntry } from "@/entities/dungeon-log/model/types";
import {
  buildLogDescription,
  formatLogTimestamp,
  resolveActionLabel,
  resolveLogCategoryLabel,
  resolveStatusLabel,
} from "@/entities/dungeon-log/lib/formatters";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";

interface LogCardProps {
  log: DungeonLogEntry;
  renderDelta?: (entry: DungeonLogEntry) => ReactNode;
  showCategoryBadge?: boolean;
  renderThumbnail?: () => ReactNode;
  onClick?: () => void;
}

export function LogCard({
  log,
  renderDelta,
  showCategoryBadge = true,
  renderThumbnail,
  onClick,
}: LogCardProps) {
  const deltaContent = renderDelta?.(log);
  const isInteractive = typeof onClick === "function";

  return (
    <Card
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        if (!isInteractive) {
          return;
        }

        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();

          if (event.key === "Enter") {
            onClick?.();
          }
        }
      }}
      onKeyUp={(event) => {
        if (!isInteractive) {
          return;
        }
        if (event.key === " ") {
          event.preventDefault();
          onClick?.();
        }
      }}
      className={cn(
        isInteractive
          ? "hover:border-primary cursor-pointer transition"
          : undefined
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {showCategoryBadge ? (
              <Badge variant="secondary" className="text-xs font-medium">
                {resolveLogCategoryLabel(log.category)}
              </Badge>
            ) : null}
            <p className="text-foreground text-sm font-semibold">
              {resolveActionLabel(log.action)}
            </p>
          </div>
        </div>
        <span className="text-muted-foreground text-xs whitespace-nowrap">
          {formatLogTimestamp(log.createdAt)}
        </span>
      </CardHeader>
      <CardContent className="flex min-h-16 justify-between gap-3">
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm">
            {buildLogDescription(log)}
          </p>
          <p className="text-muted-foreground text-xs">
            {`${log.floor}층 · ${resolveStatusLabel(log.status, log.action)}`}
          </p>
        </div>
        {renderThumbnail ? (
          <div className="flex justify-end">{renderThumbnail()}</div>
        ) : null}
      </CardContent>
      {deltaContent ? <CardFooter>{deltaContent}</CardFooter> : null}
    </Card>
  );
}

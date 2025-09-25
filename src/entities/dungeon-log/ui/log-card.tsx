import type { ReactNode } from "react";
import type { DungeonLogEntry } from "@/entities/dungeon-log/model/types";
import {
  buildLogDescription,
  formatRelativeTime,
  resolveActionLabel,
  resolveLogCategoryLabel,
  resolveStatusLabel,
} from "@/entities/dungeon-log/lib/formatters";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";

interface LogCardProps {
  log: DungeonLogEntry;
  renderDelta?: (delta: DungeonLogEntry["delta"]) => ReactNode;
  showCategoryBadge?: boolean;
}

export function LogCard({
  log,
  renderDelta,
  showCategoryBadge = false,
}: LogCardProps) {
  const content = renderDelta?.(log.delta);

  return (
    <Card>
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
          <p className="text-muted-foreground text-sm">
            {buildLogDescription(log)}
          </p>
          <p className="text-muted-foreground text-xs">
            {`${log.floor}층 · ${resolveStatusLabel(log.status, log.action)}`}
          </p>
        </div>
        <span className="text-muted-foreground text-xs whitespace-nowrap">
          {formatRelativeTime(log.timestamp)}
        </span>
      </CardHeader>
      {content ? <CardContent>{content}</CardContent> : null}
    </Card>
  );
}

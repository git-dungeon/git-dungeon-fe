import type { ReactNode } from "react";
import type { DungeonLogEntry } from "@/entities/dungeon-log/model/types";
import {
  buildLogDescription,
  formatRelativeTime,
  resolveActionLabel,
  resolveStatusLabel,
} from "@/entities/dungeon-log/lib/formatters";
import { Card, CardContent, CardHeader } from "@/shared/ui/card/card";

interface DashboardLogItemProps {
  log: DungeonLogEntry;
  renderDelta: (delta: DungeonLogEntry["delta"]) => ReactNode;
}

export function DashboardLogItem({ log, renderDelta }: DashboardLogItemProps) {
  return (
    <li>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4">
          <div>
            <p className="text-foreground text-sm font-medium">
              {resolveActionLabel(log.action)}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              {buildLogDescription(log)}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              {`${log.floor}층 · ${resolveStatusLabel(log.status, log.action)}`}
            </p>
          </div>
          <span className="text-muted-foreground text-xs whitespace-nowrap">
            {formatRelativeTime(log.timestamp)}
          </span>
        </CardHeader>
        <CardContent className="p-4 pt-0">{renderDelta(log.delta)}</CardContent>
      </Card>
    </li>
  );
}

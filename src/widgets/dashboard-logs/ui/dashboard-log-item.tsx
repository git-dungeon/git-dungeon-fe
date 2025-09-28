import type { ReactNode } from "react";
import type { DungeonLogEntry } from "@/entities/dungeon-log/model/types";
import { buildLogThumbnails } from "@/entities/dungeon-log/config/thumbnails";
import { LogCard } from "@/entities/dungeon-log/ui/log-card";
import { LogThumbnailStack } from "@/entities/dungeon-log/ui/log-thumbnail-stack";

interface DashboardLogItemProps {
  log: DungeonLogEntry;
  renderDelta: (entry: DungeonLogEntry) => ReactNode;
}

export function DashboardLogItem({ log, renderDelta }: DashboardLogItemProps) {
  const thumbnails = buildLogThumbnails(log);
  return (
    <li>
      <LogCard
        log={log}
        renderDelta={renderDelta}
        renderThumbnail={() => <LogThumbnailStack thumbnails={thumbnails} />}
      />
    </li>
  );
}

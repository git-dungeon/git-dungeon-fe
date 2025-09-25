import type { ReactNode } from "react";
import type { DungeonLogEntry } from "@/entities/dungeon-log/model/types";
import { LogCard } from "@/entities/dungeon-log/ui/log-card";

interface DashboardLogItemProps {
  log: DungeonLogEntry;
  renderDelta: (delta: DungeonLogEntry["delta"]) => ReactNode;
}

export function DashboardLogItem({ log, renderDelta }: DashboardLogItemProps) {
  return (
    <li>
      <LogCard log={log} renderDelta={renderDelta} />
    </li>
  );
}

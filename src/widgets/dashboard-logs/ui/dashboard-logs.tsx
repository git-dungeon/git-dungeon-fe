import type { DungeonLogEntry } from "@/entities/dungeon-log/model/types";
import { DashboardLogItem } from "@/widgets/dashboard-logs/ui/dashboard-log-item";
import { DeltaList } from "@/entities/dungeon-log/ui/delta-list";

interface DashboardLogsProps {
  logs: DungeonLogEntry[];
}

export function DashboardLogs({ logs }: DashboardLogsProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-foreground text-lg font-semibold">최근 탐험 로그</h2>
      <p className="text-muted-foreground text-xs">
        최근 10개의 탐험 기록만 표시됩니다.
      </p>
      <ul className="space-y-3">
        {logs.map((log) => (
          <DashboardLogItem
            key={log.id}
            log={log}
            renderDelta={(delta) => <DeltaList delta={delta} />}
          />
        ))}
      </ul>
    </section>
  );
}

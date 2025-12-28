import type { DungeonLogEntry } from "@/entities/dungeon-log/model/types";
import { DashboardLogItem } from "@/widgets/dashboard-logs/ui/dashboard-log-item";
import { DeltaList } from "@/entities/dungeon-log/ui/delta-list";
import { useTranslation } from "react-i18next";

interface DashboardLogsProps {
  logs: DungeonLogEntry[];
}

export function DashboardLogs({ logs }: DashboardLogsProps) {
  const { t } = useTranslation();

  return (
    <section className="space-y-3">
      <h2 className="text-foreground text-lg font-semibold">
        {t("dashboard.logs.title")}
      </h2>
      <p className="text-muted-foreground text-xs">
        {t("dashboard.logs.subtitle")}
      </p>
      <ul className="space-y-3">
        {logs.map((log) => (
          <DashboardLogItem
            key={log.id}
            log={log}
            renderDelta={(entry) => <DeltaList entry={entry} />}
          />
        ))}
      </ul>
    </section>
  );
}

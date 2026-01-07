import emptyImage from "@/assets/event/empty.png";
import type { DungeonLogEntry } from "@/entities/dungeon-log/model/types";
import {
  buildLogDescription,
  formatLogTimestamp,
  resolveStatusLabel,
} from "@/entities/dungeon-log/lib/formatters";
import {
  buildLogThumbnails,
  resolveActionThumbnail,
} from "@/entities/dungeon-log/config/thumbnails";
import { useCatalogItemNameResolver } from "@/entities/catalog/model/use-catalog-item-name";
import { useCatalogMonsterNameResolver } from "@/entities/catalog/model/use-catalog-monster-name";
import { useCatalogItemRarityResolver } from "@/entities/catalog/model/use-catalog-item-rarity";
import { PixelPanel } from "@/shared/ui/pixel-panel";
import { useTranslation } from "react-i18next";

interface DashboardLogsPanelProps {
  logs: DungeonLogEntry[];
}

export function DashboardLogsPanel({ logs }: DashboardLogsPanelProps) {
  const { t } = useTranslation();
  const resolveItemName = useCatalogItemNameResolver();
  const resolveMonsterName = useCatalogMonsterNameResolver();
  const resolveItemRarity = useCatalogItemRarityResolver();

  return (
    <PixelPanel
      title={t("dashboard.panels.logs")}
      headerRight={
        <span className="pixel-text-muted pixel-text-xs">
          {t("dashboard.logs.subtitle")}
        </span>
      }
      className="h-full"
      contentClassName="gap-0"
    >
      {logs.length === 0 ? (
        <p className="pixel-text-muted pixel-text-sm">
          {t("dashboard.activity.empty.message")}
        </p>
      ) : (
        <ul className="max-h-80 space-y-2 overflow-y-auto pr-2">
          {logs.map((log) => {
            const thumbnails = buildLogThumbnails(log, {
              resolveItemName,
              resolveMonsterName,
              resolveItemRarity,
            });
            const icon =
              thumbnails.at(0)?.src ??
              resolveActionThumbnail(log.action) ??
              emptyImage;

            return (
              <li key={log.id} className="pixel-log-row">
                <div className="pixel-log-icon">
                  <img
                    src={icon}
                    alt={thumbnails.at(0)?.alt ?? t("logs.thumbnails.item")}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <p className="pixel-log-text">
                    <span className="pixel-log-time">
                      {formatLogTimestamp(log.createdAt)}
                    </span>{" "}
                    -{" "}
                    {buildLogDescription(log, {
                      resolveItemName,
                      resolveMonsterName,
                    })}
                  </p>
                  <p className="pixel-log-meta">
                    {formatFloorLabel(t, log.floor)} ·
                    {resolveStatusLabel(log.status, log.action)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </PixelPanel>
  );
}

function formatFloorLabel(
  t: (key: string, options?: Record<string, unknown>) => string,
  floor?: number | null
) {
  return typeof floor === "number"
    ? t("logs.floor", { floor })
    : t("common.placeholder");
}

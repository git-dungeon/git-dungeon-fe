import type { ReactNode } from "react";
import type { DungeonLogEntry } from "@/entities/dungeon-log/model/types";
import {
  buildLogDescription,
  formatLogTimestamp,
  resolveLogCategoryLabel,
  resolveStatusLabel,
} from "@/entities/dungeon-log/lib/formatters";
import { useCatalogItemNameResolver } from "@/entities/catalog/model/use-catalog-item-name";
import { useCatalogMonsterNameResolver } from "@/entities/catalog/model/use-catalog-monster-name";
import { BattleMonsterSummary } from "@/entities/dungeon-log/ui/battle-monster-summary";
import {
  resolveBattleMonster,
  resolveBattlePlayer,
} from "@/entities/dungeon-log/lib/monster";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const deltaContent = renderDelta?.(log);
  const isInteractive = typeof onClick === "function";
  const monster = resolveBattleMonster(log);
  const player = resolveBattlePlayer(log);
  const resolveItemName = useCatalogItemNameResolver();
  const resolveMonsterName = useCatalogMonsterNameResolver();

  const description = buildLogDescription(log, {
    resolveItemName,
    resolveMonsterName,
  });
  const meta = `${formatFloorLabel(t, log.floor)} · ${resolveStatusLabel(
    log.status,
    log.action
  )}`;
  const timestamp = formatLogTimestamp(log.createdAt);

  return (
    <div
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
        "pixel-log-card",
        isInteractive && "pixel-log-card--interactive"
      )}
    >
      <div className="pixel-log-card__content">
        <div className="pixel-log-card__details">
          <div className="pixel-log-card__header">
            {showCategoryBadge ? (
              <Badge variant="outline" className="pixel-log-badge">
                [{resolveLogCategoryLabel(log.category)}]
              </Badge>
            ) : null}
            <p className="pixel-log-text">
              <span className="pixel-log-time">[{timestamp}]</span>{" "}
              {description}
            </p>
          </div>
          <p className="pixel-log-meta">{meta}</p>
          {monster || player ? (
            <div className="pixel-log-card__summary">
              <BattleMonsterSummary
                monster={monster}
                player={player}
                resolveMonsterName={resolveMonsterName}
              />
            </div>
          ) : null}
        </div>
        {renderThumbnail ? (
          <div className="pixel-log-card__thumb">{renderThumbnail()}</div>
        ) : null}
      </div>
      {deltaContent ? (
        <div className="pixel-log-card__delta">{deltaContent}</div>
      ) : null}
    </div>
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

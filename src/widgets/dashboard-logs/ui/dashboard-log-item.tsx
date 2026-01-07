import type { ReactNode } from "react";
import type { DungeonLogEntry } from "@/entities/dungeon-log/model/types";
import { buildLogThumbnails } from "@/entities/dungeon-log/config/thumbnails";
import { useCatalogItemNameResolver } from "@/entities/catalog/model/use-catalog-item-name";
import { useCatalogMonsterNameResolver } from "@/entities/catalog/model/use-catalog-monster-name";
import { useCatalogItemRarityResolver } from "@/entities/catalog/model/use-catalog-item-rarity";
import { LogCard } from "@/entities/dungeon-log/ui/log-card";
import { LogThumbnailStack } from "@/entities/dungeon-log/ui/log-thumbnail-stack";

interface DashboardLogItemProps {
  log: DungeonLogEntry;
  renderDelta: (entry: DungeonLogEntry) => ReactNode;
}

export function DashboardLogItem({ log, renderDelta }: DashboardLogItemProps) {
  const resolveItemName = useCatalogItemNameResolver();
  const resolveMonsterName = useCatalogMonsterNameResolver();
  const resolveItemRarity = useCatalogItemRarityResolver();
  const thumbnails = buildLogThumbnails(log, {
    resolveItemName,
    resolveMonsterName,
    resolveItemRarity,
  });
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

import type { DungeonLogEntry } from "@/entities/dungeon-log/model/types";
import {
  buildLogDescription,
  resolveActionLabel,
} from "@/entities/dungeon-log/lib/formatters";
import {
  buildLogThumbnails,
  resolveThumbnailBadgePresentation,
} from "@/entities/dungeon-log/config/thumbnails";
import { DeltaList } from "@/entities/dungeon-log/ui/delta-list";
import { BattleMonsterSummary } from "@/entities/dungeon-log/ui/battle-monster-summary";
import {
  resolveBattleMonster,
  resolveBattlePlayer,
} from "@/entities/dungeon-log/lib/monster";
import { useCatalogItemNameResolver } from "@/entities/catalog/model/use-catalog-item-name";
import { useCatalogMonsterNameResolver } from "@/entities/catalog/model/use-catalog-monster-name";
import { useCatalogItemRarityResolver } from "@/entities/catalog/model/use-catalog-item-rarity";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";

interface DungeonLogDetailDialogProps {
  log: DungeonLogEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DungeonLogDetailDialog({
  log,
  open,
  onOpenChange,
}: DungeonLogDetailDialogProps) {
  const { t } = useTranslation();
  const resolveItemName = useCatalogItemNameResolver();
  const resolveMonsterName = useCatalogMonsterNameResolver();
  const resolveItemRarity = useCatalogItemRarityResolver();
  const thumbnails = log
    ? buildLogThumbnails(log, {
        resolveItemName,
        resolveMonsterName,
        resolveItemRarity,
      })
    : [];
  const monster = log ? resolveBattleMonster(log) : undefined;
  const player = log ? resolveBattlePlayer(log) : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="space-y-6 sm:max-w-lg">
        {log ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-left">
                {resolveActionLabel(log.action)}
              </DialogTitle>
              <DialogDescription className="text-left">
                {buildLogDescription(log, {
                  resolveItemName,
                  resolveMonsterName,
                })}
              </DialogDescription>
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t("logs.detail.close")}
                  className="absolute top-4 right-4"
                >
                  ✕
                </Button>
              </DialogClose>
            </DialogHeader>

            {monster || player ? (
              <div className="space-y-2">
                <p className="text-muted-foreground text-xs">
                  {t("logs.detail.battleInfo")}
                </p>
                <BattleMonsterSummary
                  monster={monster}
                  player={player}
                  size="detail"
                  resolveMonsterName={resolveMonsterName}
                />
              </div>
            ) : null}

            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">
                {t("logs.detail.images")}
              </p>
              <div className="flex flex-wrap gap-3">
                {thumbnails.length > 0 ? (
                  thumbnails.map((thumbnail) => {
                    const badgeStyles = resolveThumbnailBadgePresentation(
                      thumbnail.badge
                    );
                    const rarityClass = thumbnail.rarity
                      ? `rarity-${thumbnail.rarity}`
                      : null;
                    return (
                      <div
                        key={thumbnail.id}
                        className={cn(
                          "pixel-log-thumb relative h-16 w-16 overflow-hidden",
                          rarityClass
                        )}
                      >
                        <img
                          src={thumbnail.src}
                          alt={thumbnail.alt}
                          className="h-full w-full object-cover"
                        />
                        {badgeStyles ? (
                          <span
                            className={`absolute top-1 left-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold text-white ${badgeStyles.className}`}
                          >
                            {badgeStyles.label}
                          </span>
                        ) : null}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {t("logs.detail.noImages")}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">
                {t("logs.detail.delta")}
              </p>
              <DeltaList entry={log} />
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

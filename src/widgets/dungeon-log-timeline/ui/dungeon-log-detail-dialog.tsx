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
import { PixelButton } from "@/shared/ui/pixel-button";
import { PixelIcon } from "@/shared/ui/pixel-icon";
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
      <DialogContent className="pixel-modal max-w-lg gap-4">
        {log ? (
          <>
            <DialogClose asChild>
              <PixelButton
                type="button"
                aria-label={t("logs.detail.close")}
                pixelSize="compact"
                className="pointer-events-auto absolute top-3 right-3 z-10"
              >
                <PixelIcon name="close" />
              </PixelButton>
            </DialogClose>
            <DialogHeader className="pixel-modal__header items-start">
              <DialogTitle className="pixel-modal__title text-left">
                {resolveActionLabel(log.action)}
              </DialogTitle>
              <DialogDescription className="pixel-text-muted pixel-text-sm text-left">
                {buildLogDescription(log, {
                  resolveItemName,
                  resolveMonsterName,
                })}
              </DialogDescription>
            </DialogHeader>

            {monster || player ? (
              <section className="pixel-modal__section">
                <p className="pixel-text-xs pixel-text-muted tracking-wide uppercase">
                  {t("logs.detail.battleInfo")}
                </p>
                <BattleMonsterSummary
                  monster={monster}
                  player={player}
                  size="detail"
                  resolveMonsterName={resolveMonsterName}
                />
              </section>
            ) : null}

            <section className="pixel-modal__section">
              <p className="pixel-text-xs pixel-text-muted tracking-wide uppercase">
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
                            className={cn(
                              "pixel-checkbox pixel-log-thumb__badge absolute top-1 left-1",
                              badgeStyles.className
                            )}
                          >
                            <PixelIcon
                              name={badgeStyles.icon}
                              size={12}
                              className="pixel-checkbox__icon"
                            />
                          </span>
                        ) : null}
                      </div>
                    );
                  })
                ) : (
                  <p className="pixel-text-muted text-sm">
                    {t("logs.detail.noImages")}
                  </p>
                )}
              </div>
            </section>

            <section className="pixel-modal__section">
              <p className="pixel-text-xs pixel-text-muted tracking-wide uppercase">
                {t("logs.detail.delta")}
              </p>
              <DeltaList entry={log} />
            </section>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

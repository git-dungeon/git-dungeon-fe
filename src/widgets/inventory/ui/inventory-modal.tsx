import type { InventoryItem } from "@/entities/inventory/model/types";
import type { InventoryItemSlot } from "@/entities/inventory/model/types";
import { formatRarity } from "@/entities/dashboard/lib/formatters";
import { formatInventoryEffect } from "@/entities/inventory/lib/formatters";
import { formatDateTime } from "@/shared/lib/datetime/formatters";
import { cn } from "@/shared/lib/utils";
import { formatStatChange, resolveStatLabel } from "@/shared/lib/stats/format";
import { BADGE_TONE_CLASSES } from "@/shared/ui/tone";
import { resolveLocalItemSprite } from "@/entities/catalog/config/local-sprites";
import { getInventorySlotLabel } from "@/entities/inventory/config/slot-labels";
import { useCatalogItemNameResolver } from "@/entities/catalog/model/use-catalog-item-name";
import { useCatalogItemDescriptionResolver } from "@/entities/catalog/model/use-catalog-item-description";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

interface InventoryModalProps {
  item: InventoryItem | null;
  slot: InventoryItemSlot | null;
  isPending: boolean;
  isSyncing: boolean;
  error: Error | null;
  onClose: () => void;
  onEquip: (itemId: string) => Promise<unknown>;
  onUnequip: (itemId: string) => Promise<unknown>;
  onDiscard: (itemId: string) => Promise<unknown>;
}

export function InventoryModal({
  item,
  slot,
  isPending,
  isSyncing,
  error,
  onClose,
  onEquip,
  onUnequip,
  onDiscard,
}: InventoryModalProps) {
  const { t } = useTranslation();
  const resolveItemName = useCatalogItemNameResolver();
  const resolveDescription = useCatalogItemDescriptionResolver();
  if (!item || !slot) {
    return null;
  }

  const displayName = resolveItemName(item.code, item.name);
  const description = resolveDescription(item.code);
  const sprite = resolveLocalItemSprite(item.code);
  const isBusy = isPending || isSyncing;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose();
    }
  };

  const handleEquip = async () => {
    try {
      await onEquip(item.id);
      onClose();
    } catch {
      // 에러는 상위에서 전달된 상태로 표시한다.
    }
  };

  const handleUnequip = async () => {
    try {
      await onUnequip(item.id);
      onClose();
    } catch {
      // 에러는 상위에서 전달된 상태로 표시한다.
    }
  };

  const handleDiscard = async () => {
    try {
      await onDiscard(item.id);
      onClose();
    } catch {
      // 에러는 상위에서 전달된 상태로 표시한다.
    }
  };

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md gap-0">
        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("inventory.modal.close")}
            className="absolute top-4 right-4"
          >
            ✕
          </Button>
        </DialogClose>
        <div className="flex flex-col gap-2">
          <DialogHeader className="flex-row items-start gap-2">
            <div className="flex size-12 shrink-0 items-center justify-center">
              {sprite ? (
                <img
                  src={sprite}
                  alt={displayName}
                  className="size-12 object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="border-border bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-md border text-xs font-semibold">
                  {displayName.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div className="w-full text-left">
              <DialogTitle className="text-lg font-semibold">
                {displayName}
              </DialogTitle>
              <DialogDescription className="text-sm">
                {getInventorySlotLabel(slot)} · {formatRarity(item.rarity)}
              </DialogDescription>
            </div>
          </DialogHeader>

          <section className="flex flex-col gap-2 text-sm">
            <h3 className="text-xs">{t("inventory.modal.additionalStats")}</h3>
            <ul className="flex flex-wrap gap-2">
              {item.modifiers
                .filter((modifier) => modifier.kind === "stat")
                .map((modifier, index) => {
                  const label = resolveStatLabel(modifier.stat);
                  const { text, tone } =
                    modifier.mode === "percent"
                      ? {
                          text: `${label} ${modifier.value > 0 ? "+" : ""}${modifier.value}%`,
                          tone:
                            modifier.value > 0
                              ? ("gain" as const)
                              : modifier.value < 0
                                ? ("loss" as const)
                                : ("neutral" as const),
                        }
                      : formatStatChange(modifier.stat, modifier.value);

                  return (
                    <li
                      key={`${item.id}-modifier-${index}`}
                      className="font-medium"
                    >
                      <Badge
                        variant="outline"
                        className={cn("text-[10px]", BADGE_TONE_CLASSES[tone])}
                      >
                        {text}
                      </Badge>
                    </li>
                  );
                })}
              {item.modifiers.filter((m) => m.kind === "stat").length === 0 ? (
                <li>{t("inventory.modal.noAdditionalStats")}</li>
              ) : null}
            </ul>
          </section>

          {item.effect ? (
            <section className="flex flex-col gap-2 text-sm">
              <h3 className="text-xs">{t("inventory.modal.specialEffect")}</h3>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">
                  {formatInventoryEffect(item.effect)}
                </Badge>
              </div>
            </section>
          ) : null}

          {description ? (
            <section className="flex flex-col gap-2 text-sm">
              <h3 className="text-xs">{t("inventory.modal.description")}</h3>
              <p className="text-muted-foreground">{description}</p>
            </section>
          ) : null}

          <p className="text-xs">
            {t("inventory.modal.acquiredAt", {
              time: formatDateTime(item.createdAt),
            })}
          </p>

          {isSyncing ? (
            <p className="text-muted-foreground flex items-center gap-2 text-xs">
              <Loader2 className="size-3 animate-spin" aria-hidden />
              {t("inventory.modal.processing")}
            </p>
          ) : error ? (
            <p className="text-destructive text-xs">{error.message}</p>
          ) : null}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              onClick={handleEquip}
              disabled={item.isEquipped || isBusy}
              className="flex-1"
            >
              {t("inventory.modal.actions.equip")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleUnequip}
              disabled={!item.isEquipped || isBusy}
              className="flex-1"
            >
              {t("inventory.modal.actions.unequip")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDiscard}
              disabled={isBusy}
              className="text-background flex-1"
            >
              {t("inventory.modal.actions.discard")}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

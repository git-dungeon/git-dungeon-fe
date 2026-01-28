import type { InventoryItem } from "@/entities/inventory/model/types";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { PixelButton } from "@/shared/ui/pixel-button";
import { PixelIcon } from "@/shared/ui/pixel-icon";
import { PixelPanel } from "@/shared/ui/pixel-panel";
import { PixelPill } from "@/shared/ui/pixel-pill";
import { resolveLocalItemSprite } from "@/entities/catalog/config/local-sprites";
import { getInventorySlotLabel } from "@/entities/inventory/config/slot-labels";
import { formatRarity } from "@/entities/dashboard/lib/formatters";
import { buildDismantlePreview } from "@/widgets/inventory/lib/dismantle-preview";
import { useInventoryItemNameResolver } from "@/entities/inventory/model/use-inventory-item-name";
import { Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface InventoryDismantleModalProps {
  item: InventoryItem | null;
  open: boolean;
  isPending: boolean;
  isSyncing: boolean;
  error: Error | null;
  onClose: () => void;
  onConfirm: () => Promise<unknown>;
}

export function InventoryDismantleModal({
  item,
  open,
  isPending,
  isSyncing,
  error,
  onClose,
  onConfirm,
}: InventoryDismantleModalProps) {
  const { t } = useTranslation();
  const resolveItemName = useInventoryItemNameResolver();

  if (!item) {
    return null;
  }

  const displayName = resolveItemName(item.code, item.name);
  const sprite = resolveLocalItemSprite(item.code);
  const rarityClass = `rarity-${item.rarity ?? "common"}`;
  const isBusy = isPending || isSyncing;
  const previewItems = buildDismantlePreview(item);
  const hasPreview = previewItems.length > 0;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose();
    }
  };

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch {
      // 에러는 상위에서 전달된 상태로 표시한다.
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="pixel-modal max-w-2xl gap-4">
        <DialogClose asChild>
          <PixelButton
            type="button"
            aria-label={t("inventory.modal.close")}
            pixelSize="compact"
            className="pointer-events-auto absolute top-3 right-3 z-10"
          >
            <PixelIcon name="close" />
          </PixelButton>
        </DialogClose>

        <DialogHeader className="pixel-modal-header items-start">
          <DialogTitle className="pixel-modal-title text-left">
            {t("inventory.dismantle.title")}
          </DialogTitle>
          <DialogDescription className="pixel-text-muted pixel-text-sm text-left">
            {t("inventory.dismantle.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <PixelPanel
            title={t("inventory.dismantle.slotTitle")}
            contentClassName="flex flex-col items-center gap-3"
            className="h-full"
          >
            <div
              className={cn(
                "inventory-item-icon flex size-20 items-center justify-center",
                rarityClass
              )}
            >
              {sprite ? (
                <img
                  src={sprite}
                  alt={displayName}
                  className="size-14 object-contain"
                  loading="lazy"
                />
              ) : (
                <div className="pixel-text-muted pixel-text-xs font-semibold tracking-wide">
                  {displayName.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="pixel-text-sm font-semibold">{displayName}</p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="pixel-text-muted text-xs">
                  {getInventorySlotLabel(item.slot)}
                </span>
                <PixelPill
                  tone="rarity"
                  rarity={item.rarity}
                  className="text-[10px] font-semibold tracking-wide uppercase"
                >
                  {formatRarity(item.rarity)}
                </PixelPill>
              </div>
            </div>
          </PixelPanel>

          <PixelPanel
            title={t("inventory.dismantle.expectedTitle")}
            contentClassName="flex flex-wrap items-start gap-3"
            className="h-full"
          >
            {previewItems.length > 0 ? (
              previewItems.map((preview, index) => {
                const materialSprite = resolveLocalItemSprite(preview.code);
                const materialName = resolveItemName(
                  preview.code,
                  preview.code
                );
                return (
                  <div
                    key={`${preview.code}-${index}`}
                    className="relative flex flex-col items-center gap-1"
                  >
                    <div className="inventory-item-icon flex size-14 items-center justify-center">
                      {materialSprite ? (
                        <img
                          src={materialSprite}
                          alt={materialName}
                          className="size-10 object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <div className="pixel-text-muted pixel-text-xs font-semibold tracking-wide">
                          {materialName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="pixel-text-xs pixel-text-muted font-semibold">
                      x{preview.quantity}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="pixel-text-muted text-sm">
                {t("inventory.dismantle.empty")}
              </p>
            )}
          </PixelPanel>
        </div>

        {isBusy ? (
          <p className="pixel-text-muted flex items-center gap-2 text-xs">
            <Loader2 className="size-3 animate-spin" aria-hidden />
            {t("inventory.modal.processing")}
          </p>
        ) : error ? (
          <p className="pixel-text-danger text-xs">{error.message}</p>
        ) : null}

        <DialogFooter className="flex-wrap gap-2">
          <DialogClose asChild>
            <PixelButton type="button" className="pixel-text-xs flex-1">
              {t("inventory.dismantle.cancel")}
            </PixelButton>
          </DialogClose>
          <PixelButton
            type="button"
            onClick={handleConfirm}
            disabled={isBusy || !hasPreview}
            tone="accent"
            className="pixel-text-xs flex-1"
          >
            {t("inventory.dismantle.confirm")}
          </PixelButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

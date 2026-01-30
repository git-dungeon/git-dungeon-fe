import type { InventoryItem } from "@/entities/inventory/model/types";
import { useEffect, useMemo, useState } from "react";
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
import { PixelInput } from "@/shared/ui/pixel-input";
import { PixelSlider } from "@/shared/ui/pixel-slider";
import { resolveLocalItemSprite } from "@/entities/catalog/config/local-sprites";
import { useInventoryItemNameResolver } from "@/entities/inventory/model/use-inventory-item-name";
import { Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface InventoryDiscardModalProps {
  item: InventoryItem | null;
  open: boolean;
  isPending: boolean;
  isSyncing: boolean;
  error: Error | null;
  onClose: () => void;
  onConfirm: (quantity: number) => Promise<unknown>;
}

export function InventoryDiscardModal({
  item,
  open,
  isPending,
  isSyncing,
  error,
  onClose,
  onConfirm,
}: InventoryDiscardModalProps) {
  const { t } = useTranslation();
  const resolveItemName = useInventoryItemNameResolver();
  const maxQuantity = Math.max(item?.quantity ?? 1, 1);
  const [quantity, setQuantity] = useState(1);
  const sprite = item ? resolveLocalItemSprite(item.code) : null;
  const displayName = item
    ? resolveItemName(item.code, item.name)
    : t("inventory.modal.item");
  const rarityClass = `rarity-${item?.rarity ?? "common"}`;
  const isBusy = isPending || isSyncing;

  const clampedQuantity = useMemo(() => {
    if (!Number.isFinite(quantity)) {
      return 1;
    }
    return Math.min(Math.max(1, Math.round(quantity)), maxQuantity);
  }, [maxQuantity, quantity]);

  useEffect(() => {
    if (!open) {
      return;
    }
    setQuantity(1);
  }, [open, item?.id]);

  useEffect(() => {
    if (quantity !== clampedQuantity) {
      setQuantity(clampedQuantity);
    }
  }, [clampedQuantity, quantity]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose();
    }
  };

  const handleInputChange = (value: string) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      setQuantity(1);
      return;
    }
    setQuantity(parsed);
  };

  const handleSliderChange = (values: number[]) => {
    const nextValue = values[0] ?? 1;
    setQuantity(nextValue);
  };

  const handleConfirm = async () => {
    try {
      await onConfirm(clampedQuantity);
    } catch {
      // 에러는 상위에서 전달된 상태로 표시한다.
    }
  };

  if (!item) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="pixel-modal max-w-lg gap-4">
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
            {t("inventory.discard.title")}
          </DialogTitle>
          <DialogDescription className="pixel-text-muted pixel-text-sm text-left">
            {t("inventory.discard.description")}
          </DialogDescription>
        </DialogHeader>

        <PixelPanel contentClassName="flex flex-col items-center gap-4">
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
                className="size-12 object-contain"
                loading="lazy"
              />
            ) : (
              <div className="pixel-text-muted pixel-text-xs font-semibold tracking-wide">
                {displayName.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <p className="pixel-text-sm font-semibold">{displayName}</p>
          <div className="w-full space-y-3">
            <div className="flex flex-col items-center gap-2">
              <PixelInput
                type="number"
                min={1}
                max={maxQuantity}
                value={clampedQuantity}
                onChange={(event) => handleInputChange(event.target.value)}
                className="w-24 text-center text-sm"
              />
              <span className="pixel-text-muted text-xs">
                {t("inventory.discard.available", { count: maxQuantity })}
              </span>
            </div>
            <PixelSlider
              min={1}
              max={maxQuantity}
              step={1}
              value={[clampedQuantity]}
              onValueChange={handleSliderChange}
            />
          </div>
        </PixelPanel>

        {isBusy ? (
          <p className="pixel-text-muted flex items-center gap-2 text-xs">
            <Loader2 className="size-3 animate-spin" aria-hidden />
            {t("inventory.modal.processing")}
          </p>
        ) : error ? (
          <p className="pixel-text-danger text-xs">{error.message}</p>
        ) : null}

        <DialogFooter className="flex-wrap gap-2">
          <PixelButton
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="pixel-text-xs flex-1"
          >
            {t("inventory.discard.cancel")}
          </PixelButton>
          <PixelButton
            type="button"
            onClick={handleConfirm}
            disabled={isBusy}
            tone="danger"
            className="pixel-text-xs flex-1"
          >
            {t("inventory.discard.confirm")}
          </PixelButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

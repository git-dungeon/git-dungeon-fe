import type {
  InventoryItem,
  InventoryResponse,
} from "@/entities/inventory/model/types";
import type { InventoryItemSlot } from "@/entities/inventory/model/types";
import { useState } from "react";
import { formatRarity } from "@/entities/dashboard/lib/formatters";
import { formatInventoryEffect } from "@/entities/inventory/lib/formatters";
import { formatDateTime } from "@/shared/lib/datetime/formatters";
import { cn } from "@/shared/lib/utils";
import { formatStatChange, resolveStatLabel } from "@/shared/lib/stats/format";
import { resolveLocalItemSprite } from "@/entities/catalog/config/local-sprites";
import { getInventorySlotLabel } from "@/entities/inventory/config/slot-labels";
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
import { PixelButton } from "@/shared/ui/pixel-button";
import { PixelPill } from "@/shared/ui/pixel-pill";
import { PixelIcon } from "@/shared/ui/pixel-icon";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { copyText } from "@/shared/lib/clipboard";
import { InventoryDismantleModal } from "@/widgets/inventory/ui/inventory-dismantle-modal";
import { InventoryDiscardModal } from "@/widgets/inventory/ui/inventory-discard-modal";
import {
  InventoryEnhanceModal,
  type InventoryEnhanceResult,
} from "@/widgets/inventory/ui/inventory-enhance-modal";
import { canDismantleItem } from "@/widgets/inventory/lib/dismantle-preview";
import { useInventoryItemNameResolver } from "@/entities/inventory/model/use-inventory-item-name";
import { isEquippableSlot } from "@/entities/inventory/lib/equipable";
import {
  formatEnhancementStars,
  resolveEnhancementBonus,
  resolveEnhancementLevel,
} from "@/entities/inventory/lib/enhancement";

interface InventoryModalProps {
  item: InventoryItem | null;
  slot: InventoryItemSlot | null;
  isPending: boolean;
  isSyncing: boolean;
  error: Error | null;
  onClose: () => void;
  onEquip: (itemId: string) => Promise<unknown>;
  onUnequip: (itemId: string) => Promise<unknown>;
  onDiscard: (itemId: string, quantity?: number) => Promise<unknown>;
  onDismantle: (itemId: string) => Promise<unknown>;
  onEnhance?: (itemId: string) => Promise<unknown>;
  onClearError: () => void;
  dismantleError: Error | null;
  enhanceError?: Error | null;
  items?: InventoryItem[];
  gold?: number;
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
  onDismantle,
  onEnhance,
  onClearError,
  dismantleError,
  enhanceError,
  items,
  gold,
}: InventoryModalProps) {
  const { t } = useTranslation();
  const resolveItemName = useInventoryItemNameResolver();
  const resolveDescription = useCatalogItemDescriptionResolver();
  const [isDismantleOpen, setIsDismantleOpen] = useState(false);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const [isEnhanceOpen, setIsEnhanceOpen] = useState(false);
  const [enhanceResult, setEnhanceResult] =
    useState<InventoryEnhanceResult>(null);
  if (!item || !slot) {
    return null;
  }

  const displayName = resolveItemName(item.code, item.name);
  const description = resolveDescription(item.code);
  const sprite = resolveLocalItemSprite(item.code);
  const isBusy = isPending || isSyncing;
  const shortId = item.id.slice(-8);
  const displayId = `#${shortId}`;
  const rarityClass = `rarity-${item.rarity ?? "common"}`;
  const canDismantle = canDismantleItem(item);
  const canEquip = isEquippableSlot(item.slot);
  const maxQuantity = Math.max(item.quantity ?? 1, 1);
  const inventoryItems = items ?? [];
  const currentGold = gold ?? 0;
  const enhancementLevel = resolveEnhancementLevel(item.enhancementLevel);
  const enhancementStars = formatEnhancementStars(enhancementLevel);
  const enhancementBonus = resolveEnhancementBonus(item.slot, enhancementLevel);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose();
    }
  };

  const handleCopyId = async () => {
    const copied = await copyText(item.id);
    if (copied) {
      toast.success(t("inventory.modal.copyIdSuccess"));
    } else {
      toast.error(t("inventory.modal.copyIdError"));
    }
  };

  const handleEquip = async () => {
    if (!canEquip) {
      return;
    }
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
    if (maxQuantity > 1) {
      onClearError();
      setIsDiscardOpen(true);
      return;
    }
    try {
      await onDiscard(item.id);
      onClose();
    } catch {
      // 에러는 상위에서 전달된 상태로 표시한다.
    }
  };

  const handleOpenDismantle = () => {
    onClearError();
    setIsDismantleOpen(true);
  };

  const handleCloseDismantle = () => {
    setIsDismantleOpen(false);
  };

  const handleCloseDiscard = () => {
    setIsDiscardOpen(false);
  };

  const handleOpenEnhance = () => {
    onClearError();
    setEnhanceResult(null);
    setIsEnhanceOpen(true);
  };

  const handleCloseEnhance = () => {
    setEnhanceResult(null);
    setIsEnhanceOpen(false);
  };

  const handleConfirmDismantle = async () => {
    try {
      await onDismantle(item.id);
      setIsDismantleOpen(false);
      onClose();
    } catch {
      // 에러는 상위에서 전달된 상태로 표시한다.
    }
  };

  const handleConfirmDiscard = async (quantity: number) => {
    try {
      await onDiscard(item.id, quantity);
      setIsDiscardOpen(false);
      onClose();
    } catch {
      // 에러는 상위에서 전달된 상태로 표시한다.
    }
  };

  const handleConfirmEnhance = async () => {
    if (!onEnhance) {
      return;
    }

    const previousLevel = resolveEnhancementLevel(item.enhancementLevel);
    try {
      const nextInventory = await onEnhance(item.id);
      if (isInventoryResponse(nextInventory)) {
        const nextItem = nextInventory.items.find(
          (inventoryItem) => inventoryItem.id === item.id
        );
        const nextLevel = resolveEnhancementLevel(nextItem?.enhancementLevel);
        setEnhanceResult(nextLevel > previousLevel ? "success" : "fail");
      }
    } catch {
      // 에러는 상위에서 전달된 상태로 표시한다.
    }
  };

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className="pixel-modal max-w-xl gap-4">
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
        <div className="flex flex-col gap-4">
          <DialogHeader className="flex-row items-start gap-3">
            <div
              className={cn(
                "inventory-item-icon flex size-16 shrink-0 items-center justify-center",
                rarityClass
              )}
            >
              {sprite ? (
                <img
                  src={sprite}
                  alt={displayName}
                  className="size-10 object-contain"
                  loading="lazy"
                />
              ) : (
                <div className="text-muted-foreground flex size-10 items-center justify-center text-xs font-semibold">
                  {displayName.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div className="w-full text-left">
              <DialogTitle className="pixel-modal-title">
                {displayName}
              </DialogTitle>
              <DialogDescription className="pixel-text-muted pixel-text-sm flex flex-wrap items-center gap-2">
                <span className="pixel-modal-slot-label">
                  {getInventorySlotLabel(slot)}
                </span>
                <PixelPill
                  tone="rarity"
                  rarity={item.rarity}
                  className="text-[10px] font-semibold tracking-wide uppercase"
                >
                  {formatRarity(item.rarity)}
                </PixelPill>
                {enhancementStars ? (
                  <PixelPill
                    tone="neutral"
                    className="text-[10px] font-semibold"
                  >
                    {t("inventory.enhancement.level", {
                      level: enhancementLevel,
                    })}
                  </PixelPill>
                ) : null}
              </DialogDescription>
            </div>
          </DialogHeader>

          <section className="flex flex-col gap-2 text-sm">
            <h3 className="pixel-text-xs pixel-text-muted tracking-wide uppercase">
              {t("inventory.modal.additionalStats")}
            </h3>
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
                              ? ("success" as const)
                              : modifier.value < 0
                                ? ("danger" as const)
                                : ("neutral" as const),
                        }
                      : formatStatChange(modifier.stat, modifier.value);

                  const iconTone =
                    tone === "success"
                      ? "up"
                      : tone === "danger"
                        ? "down"
                        : null;

                  return (
                    <li
                      key={`${item.id}-modifier-${index}`}
                      className="font-medium"
                    >
                      <PixelPill
                        tone={tone}
                        icon={iconTone ?? undefined}
                        className="text-[10px]"
                      >
                        {text}
                      </PixelPill>
                    </li>
                  );
                })}
              {item.modifiers.filter((m) => m.kind === "stat").length === 0 ? (
                <li className="pixel-text-muted">
                  {t("inventory.modal.noAdditionalStats")}
                </li>
              ) : null}
            </ul>
            {enhancementBonus ? (
              <p className="pixel-text-xs pixel-text-muted font-semibold">
                {t("inventory.enhancement.bonusLine", {
                  stat: resolveStatLabel(enhancementBonus.stat),
                  value: enhancementBonus.value,
                })}
              </p>
            ) : null}
          </section>

          {item.effect ? (
            <section className="flex flex-col gap-2 text-sm">
              <h3 className="pixel-text-xs pixel-text-muted tracking-wide uppercase">
                {t("inventory.modal.specialEffect")}
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <PixelPill tone="neutral" className="text-[10px]">
                  {formatInventoryEffect(item.effect)}
                </PixelPill>
              </div>
            </section>
          ) : null}

          {description ? (
            <section className="flex flex-col gap-2 text-sm">
              <h3 className="pixel-text-xs pixel-text-muted tracking-wide uppercase">
                {t("inventory.modal.description")}
              </h3>
              <p className="pixel-text-muted">{description}</p>
            </section>
          ) : null}

          <div className="pixel-text-muted flex flex-col gap-1 text-xs">
            <span>
              {t("inventory.modal.acquiredAt", {
                time: formatDateTime(item.createdAt),
              })}
            </span>
            <div className="flex items-center justify-between gap-2">
              <span>{t("inventory.modal.itemId", { id: displayId })}</span>
              <PixelButton
                type="button"
                onClick={handleCopyId}
                pixelSize="compact"
                className="gap-2"
              >
                <PixelIcon name="copy" />
                {t("inventory.modal.copyId")}
              </PixelButton>
            </div>
          </div>

          {isSyncing ? (
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
              onClick={handleEquip}
              disabled={item.isEquipped || isBusy || !canEquip}
              className="pixel-text-xs flex-1"
            >
              {t("inventory.modal.actions.equip")}
            </PixelButton>
            <PixelButton
              type="button"
              onClick={handleUnequip}
              disabled={!item.isEquipped || isBusy}
              className="pixel-text-xs flex-1"
            >
              {t("inventory.modal.actions.unequip")}
            </PixelButton>
            <PixelButton
              type="button"
              onClick={handleOpenEnhance}
              disabled={!canEquip || isBusy || !onEnhance}
              tone="accent"
              className="pixel-text-xs flex-1"
            >
              {t("inventory.modal.actions.enhance")}
            </PixelButton>
            <PixelButton
              type="button"
              onClick={handleDiscard}
              disabled={isBusy}
              tone="danger"
              className="pixel-text-xs flex-1"
            >
              {t("inventory.modal.actions.discard")}
            </PixelButton>
            <PixelButton
              type="button"
              onClick={handleOpenDismantle}
              disabled={!canDismantle || isBusy}
              tone="accent"
              className="pixel-text-xs flex-1"
            >
              {t("inventory.modal.actions.dismantle")}
            </PixelButton>
          </DialogFooter>
        </div>
      </DialogContent>
      <InventoryDismantleModal
        item={item}
        open={isDismantleOpen}
        isPending={isPending}
        isSyncing={isSyncing}
        error={dismantleError}
        onClose={handleCloseDismantle}
        onConfirm={handleConfirmDismantle}
      />
      <InventoryDiscardModal
        item={item}
        open={isDiscardOpen}
        isPending={isPending}
        isSyncing={isSyncing}
        error={error}
        onClose={handleCloseDiscard}
        onConfirm={handleConfirmDiscard}
      />
      <InventoryEnhanceModal
        item={item}
        items={inventoryItems}
        gold={currentGold}
        open={isEnhanceOpen}
        isPending={isPending}
        isSyncing={isSyncing}
        error={enhanceError ?? null}
        result={enhanceResult}
        onClose={handleCloseEnhance}
        onConfirm={handleConfirmEnhance}
      />
    </Dialog>
  );
}

function isInventoryResponse(value: unknown): value is InventoryResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const data = value as { items?: unknown };
  return Array.isArray(data.items);
}

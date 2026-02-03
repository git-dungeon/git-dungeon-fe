import forgeImage from "@/assets/enhancement/forge.png";
import goldImage from "@/assets/event/gold.png";
import { resolveLocalItemSprite } from "@/entities/catalog/config/local-sprites";
import { useCatalog } from "@/entities/catalog/model/use-catalog";
import { useCatalogItemNameResolver } from "@/entities/catalog/model/use-catalog-item-name";
import type { InventoryItem } from "@/entities/inventory/model/types";
import { buildEnhancementPreview } from "@/widgets/inventory/lib/enhancement-preview";
import { cn } from "@/shared/lib/utils";
import { resolveStatLabel } from "@/shared/lib/stats/format";
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
import { PixelPanel } from "@/shared/ui/pixel-panel";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export type InventoryEnhanceResult = "success" | "fail" | null;

interface InventoryEnhanceModalProps {
  item: InventoryItem | null;
  items: InventoryItem[];
  gold: number;
  open: boolean;
  isPending: boolean;
  isSyncing: boolean;
  error: Error | null;
  result: InventoryEnhanceResult;
  onClose: () => void;
  onConfirm: () => Promise<unknown>;
}

export function InventoryEnhanceModal({
  item,
  items,
  gold,
  open,
  isPending,
  isSyncing,
  error,
  result,
  onClose,
  onConfirm,
}: InventoryEnhanceModalProps) {
  const { t } = useTranslation();
  const resolveItemName = useCatalogItemNameResolver();
  const catalogQuery = useCatalog();
  const config = catalogQuery.data?.enhancement;

  if (!item) {
    return null;
  }

  const displayName = resolveItemName(item.code, item.name);
  const sprite = resolveLocalItemSprite(item.code);
  const rarityClass = `rarity-${item.rarity ?? "common"}`;
  const isBusy = isPending || isSyncing;
  const preview = config
    ? buildEnhancementPreview(item.slot, item.enhancementLevel, config)
    : null;

  const availableMaterialCount = preview?.materialCode
    ? items.reduce((sum, inventoryItem) => {
        if (inventoryItem.code !== preview.materialCode) {
          return sum;
        }

        return sum + (inventoryItem.quantity ?? 1);
      }, 0)
    : 0;

  const requiredGold = preview?.goldCost ?? 0;
  const requiredMaterialCount = preview?.materialCount ?? 0;
  const hasEnoughGold = preview?.goldCost == null ? true : gold >= requiredGold;
  const hasEnoughMaterial =
    preview?.materialCount == null
      ? true
      : availableMaterialCount >= requiredMaterialCount;

  const disabledReason = resolveDisabledReason({
    preview,
    hasEnoughGold,
    hasEnoughMaterial,
    catalogLoaded: Boolean(config),
    t,
  });

  const materialSprite = preview?.materialCode
    ? resolveLocalItemSprite(preview.materialCode)
    : undefined;
  const materialName = preview?.materialCode
    ? resolveItemName(preview.materialCode, preview.materialCode)
    : t("inventory.enhance.materialUnknown");
  const successRatePercent =
    preview?.successRate == null ? null : Math.round(preview.successRate * 100);

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
      <DialogContent className="pixel-modal max-w-5xl gap-4">
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
            {t("inventory.enhance.title")}
          </DialogTitle>
          <DialogDescription className="pixel-text-muted pixel-text-sm text-left">
            {t("inventory.enhance.description")}
          </DialogDescription>
        </DialogHeader>

        <PixelPanel contentClassName="space-y-4" className="h-full">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center">
            <section className="space-y-3">
              <h3 className="pixel-text-sm border-b border-white/15 pb-1 text-center font-semibold tracking-wide uppercase">
                {t("inventory.enhance.itemTitle")}
              </h3>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "inventory-item-icon flex size-24 items-center justify-center",
                    rarityClass
                  )}
                >
                  {sprite ? (
                    <img
                      src={sprite}
                      alt={displayName}
                      className="size-16 object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <span className="pixel-text-xs pixel-text-muted font-semibold">
                      {displayName.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="pixel-text-sm text-center font-semibold">
                  {displayName}
                </p>
              </div>
            </section>

            <div className="mx-auto flex items-center justify-center">
              <img
                src={forgeImage}
                alt={t("inventory.enhance.forgeAlt")}
                className="h-28 w-28 object-contain md:h-32 md:w-32"
                loading="lazy"
              />
            </div>

            <section className="space-y-3">
              <h3 className="pixel-text-sm border-b border-white/15 pb-1 text-center font-semibold tracking-wide uppercase">
                {t("inventory.enhance.previewTitle")}
              </h3>
              <div className="flex items-start justify-center gap-3">
                <div
                  className={cn(
                    "inventory-item-icon flex size-24 items-center justify-center",
                    rarityClass
                  )}
                >
                  {sprite ? (
                    <img
                      src={sprite}
                      alt={displayName}
                      className="size-16 object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <span className="pixel-text-xs pixel-text-muted font-semibold">
                      {displayName.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  {preview ? (
                    <>
                      <p className="pixel-text-success pixel-text-sm font-semibold">
                        {t("inventory.enhance.previewBonus", {
                          stat: resolveStatLabel(preview.bonusStat),
                          value: preview.nextBonus,
                        })}
                      </p>
                      <p className="pixel-text-muted pixel-text-xs">
                        {t("inventory.enhance.levelRange", {
                          current: preview.currentLevel,
                          next: preview.nextLevel,
                        })}
                      </p>
                      <p className="pixel-text-muted pixel-text-xs">
                        {t("inventory.enhance.successRate", {
                          rate: successRatePercent ?? "-",
                        })}
                      </p>
                    </>
                  ) : (
                    <p className="pixel-text-muted pixel-text-sm">
                      {t("inventory.enhance.unavailable")}
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>
        </PixelPanel>

        <PixelPanel
          title={t("inventory.enhance.materialTitle")}
          contentClassName="space-y-4"
          className="h-full"
        >
          <div className="flex flex-wrap items-center gap-4">
            <RequirementCard
              icon={goldImage}
              name={t("inventory.enhance.goldLabel")}
              current={gold}
              required={requiredGold}
              complete={hasEnoughGold}
            />
            <RequirementCard
              icon={materialSprite}
              name={materialName}
              current={availableMaterialCount}
              required={requiredMaterialCount}
              complete={hasEnoughMaterial}
            />
          </div>

          <div className="flex justify-center">
            <PixelButton
              type="button"
              onClick={handleConfirm}
              disabled={isBusy || Boolean(disabledReason)}
              tone="accent"
              className="pixel-text-sm min-w-56"
            >
              {t("inventory.enhance.confirm")}
            </PixelButton>
          </div>

          {isBusy ? (
            <p className="pixel-text-muted flex items-center justify-center gap-2 text-xs">
              <Loader2 className="size-3 animate-spin" aria-hidden />
              {t("inventory.modal.processing")}
            </p>
          ) : null}
          {!isBusy && disabledReason ? (
            <p className="pixel-text-muted text-center text-xs">
              {disabledReason}
            </p>
          ) : null}
          {!isBusy && error ? (
            <p className="pixel-text-danger text-center text-xs">
              {error.message}
            </p>
          ) : null}
          {!isBusy && result === "success" ? (
            <p className="pixel-text-success text-center text-xs">
              {t("inventory.enhance.resultSuccess")}
            </p>
          ) : null}
          {!isBusy && result === "fail" ? (
            <p className="pixel-text-danger text-center text-xs">
              {t("inventory.enhance.resultFail")}
            </p>
          ) : null}
        </PixelPanel>
      </DialogContent>
    </Dialog>
  );
}

interface RequirementCardProps {
  icon: string | undefined;
  name: string;
  current: number;
  required: number;
  complete: boolean;
}

function RequirementCard({
  icon,
  name,
  current,
  required,
  complete,
}: RequirementCardProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="inventory-item-icon flex size-12 items-center justify-center">
        {icon ? (
          <img
            src={icon}
            alt={name}
            className="size-8 object-contain"
            loading="lazy"
          />
        ) : (
          <span className="pixel-text-muted pixel-text-xs font-semibold">
            {name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <p className="pixel-text-sm font-semibold">
        {name}{" "}
        <span
          className={cn(complete ? "pixel-text-success" : "pixel-text-danger")}
        >
          ({current}/{required})
        </span>
      </p>
    </div>
  );
}

function resolveDisabledReason(params: {
  preview: ReturnType<typeof buildEnhancementPreview> | null;
  hasEnoughGold: boolean;
  hasEnoughMaterial: boolean;
  catalogLoaded: boolean;
  t: (key: string) => string;
}): string | null {
  if (!params.catalogLoaded) {
    return params.t("inventory.enhance.unavailable");
  }

  if (!params.preview) {
    return params.t("inventory.enhance.unavailable");
  }

  if (params.preview.isMaxLevel) {
    return params.t("inventory.enhance.disabledMax");
  }

  if (!params.hasEnoughGold) {
    return params.t("inventory.enhance.disabledGold");
  }

  if (!params.hasEnoughMaterial) {
    return params.t("inventory.enhance.disabledMaterial");
  }

  return null;
}

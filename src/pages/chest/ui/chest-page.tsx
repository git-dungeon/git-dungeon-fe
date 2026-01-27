import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { PixelButton } from "@/shared/ui/pixel-button";
import { PixelErrorState, PixelSkeletonState } from "@/shared/ui/pixel-state";
import { PixelPill } from "@/shared/ui/pixel-pill";
import { useDashboardState } from "@/entities/dashboard/model/use-dashboard-state";
import { useQueryClient } from "@tanstack/react-query";
import chestIcon from "@/assets/event/chest.png";
import { resolveLocalItemSprite } from "@/entities/catalog/config/local-sprites";
import { useCatalog } from "@/entities/catalog/model/use-catalog";
import type { InventoryItem } from "@/entities/inventory/model/types";
import { cn } from "@/shared/lib/utils";
import { ChestSlot } from "@/pages/chest/ui/chest-slot";
import { useChestOpening } from "@/pages/chest/model/use-chest-opening";

export function ChestPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const dashboardQuery = useDashboardState();
  const catalogQuery = useCatalog();
  const unopenedChests = dashboardQuery.data?.unopenedChests ?? 0;

  const createdAtRef = useRef(new Date().toISOString());

  const {
    phase,
    currentItem,
    error,
    openCycle,
    shouldDisableOpen,
    buttonLabel,
    handleOpen,
    handleSkip,
    slotRarity,
    frameTone,
  } = useChestOpening({
    unopenedChests,
    queryClient,
    t,
  });
  const isOpening = phase === "spinning" || phase === "confirm";

  const catalogItemMap = useMemo(() => {
    const items = catalogQuery.data?.items ?? [];
    return new Map(items.map((item) => [item.code, item]));
  }, [catalogQuery.data]);

  const catalogItem = currentItem
    ? (catalogItemMap.get(currentItem.code) ?? null)
    : null;

  const itemLabel = catalogItem?.name ?? currentItem?.code ?? "";
  const itemSprite = currentItem
    ? (resolveLocalItemSprite(currentItem.code) ?? null)
    : null;

  const displayItem = useMemo<InventoryItem | null>(() => {
    if (!currentItem) {
      return null;
    }

    return {
      id: currentItem.itemId,
      code: currentItem.code,
      name: catalogItem?.name ?? currentItem.code,
      slot: catalogItem?.slot ?? currentItem.slot,
      rarity: currentItem.rarity,
      modifiers: catalogItem?.modifiers ?? [],
      effect: catalogItem?.effectCode ?? null,
      sprite: null,
      createdAt: createdAtRef.current,
      isEquipped: false,
      version: 0,
    };
  }, [catalogItem, currentItem]);

  return (
    <section className="chest-page space-y-6">
      <header className="level-up-page-header chest-page-header">
        <div className="space-y-1">
          <h1 className="font-pixel-title pixel-page-title">
            {t("chest.page.title")}
          </h1>
          <p className="chest-page-subtitle">{t("chest.page.subtitle")}</p>
        </div>
        <div className="level-up-page-points chest-page-counter">
          <span className="level-up-page-points-label chest-page-counter-label">
            {t("chest.page.countLabel")}
          </span>
          <PixelPill icon="count">
            {t("chest.page.count", { count: unopenedChests })}
          </PixelPill>
        </div>
      </header>

      {dashboardQuery.isError ? (
        <PixelErrorState message={t("chest.page.error")} />
      ) : null}

      {dashboardQuery.isLoading ? (
        <PixelSkeletonState titleWidth="w-1/3" lineWidths={["w-full"]} />
      ) : null}

      {error ? <PixelErrorState message={error} /> : null}

      <div className="chest-stage">
        <ChestSlot
          phase={phase}
          openCycle={openCycle}
          slotRarity={slotRarity}
          frameTone={frameTone}
          currentItem={currentItem}
          displayItem={displayItem}
          itemSprite={itemSprite}
          itemLabel={itemLabel}
          emptyAlt={t("chest.page.emptyAlt")}
          emptyIcon={chestIcon}
        />
      </div>

      <div className="chest-actions">
        <PixelButton
          type="button"
          tone="accent"
          onClick={handleOpen}
          disabled={shouldDisableOpen}
        >
          {buttonLabel}
        </PixelButton>
        <PixelButton
          type="button"
          pixelSize="compact"
          onClick={handleSkip}
          disabled={!isOpening}
          className={cn("chest-skip", !isOpening && "chest-skip--hidden")}
        >
          {t("chest.page.skip")}
        </PixelButton>
      </div>
    </section>
  );
}

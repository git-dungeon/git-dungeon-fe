import { PixelPanel } from "@/shared/ui/pixel-panel";
import { PixelButton } from "@/shared/ui/pixel-button";
import { InventoryLayout } from "@/widgets/inventory/ui/inventory-layout";
import { useInventoryActions } from "@/features/inventory/model/use-inventory-actions";
import { useCharacterOverview } from "@/features/character-summary/model/use-character-overview";
import { useProfile } from "@/entities/profile/model/use-profile";
import { useTranslation } from "react-i18next";

export function InventoryPage() {
  const { t } = useTranslation();
  const overview = useCharacterOverview();
  const actions = useInventoryActions();
  const profileQuery = useProfile();

  const inventoryData = overview.inventory.data;
  const items = inventoryData?.items ?? [];
  const showLoading = overview.isLoading && !inventoryData;
  const avatarUrl = profileQuery.data?.profile.avatarUrl ?? null;

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1
          className="font-pixel-title pixel-page-title"
          data-text={t("inventory.title")}
        >
          {t("inventory.title")}
        </h1>
        <p className="pixel-text-muted pixel-text-sm">
          {t("inventory.subtitle")}
        </p>
      </header>

      {overview.isError ? (
        <PixelPanel
          className="p-4"
          contentClassName="flex flex-wrap items-center justify-between gap-3 text-sm"
        >
          <span className="pixel-text-danger">{t("inventory.loadError")}</span>
          <PixelButton
            type="button"
            onClick={() => {
              void overview.refetch();
            }}
            pixelSize="compact"
            className="pixel-text-xs"
          >
            {t("inventory.retry")}
          </PixelButton>
        </PixelPanel>
      ) : null}

      {showLoading ? (
        <PixelPanel
          className="p-4"
          contentClassName="animate-pulse space-y-2 text-sm"
        >
          <div className="bg-muted h-4 w-1/3 rounded" />
          <div className="bg-muted h-4 w-2/3 rounded" />
          <div className="bg-muted h-20 rounded" />
        </PixelPanel>
      ) : null}

      {!showLoading &&
      !overview.isFetching &&
      !overview.isError &&
      items.length === 0 ? (
        <PixelPanel className="p-4" contentClassName="text-sm">
          <span className="pixel-text-muted">{t("inventory.empty")}</span>
        </PixelPanel>
      ) : null}

      {inventoryData && overview.data ? (
        <InventoryLayout
          items={inventoryData.items}
          equipped={inventoryData.equipped}
          stats={overview.data.stats}
          level={overview.data.level}
          avatarUrl={avatarUrl}
          isPending={actions.isPending}
          isSyncing={actions.isSyncing}
          error={actions.error}
          onEquip={actions.equip}
          onUnequip={actions.unequip}
          onDiscard={actions.discard}
          onClearError={actions.clearError}
        />
      ) : null}
    </section>
  );
}

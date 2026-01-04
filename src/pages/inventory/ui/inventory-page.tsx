import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
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
        <Card className="border-destructive/30 pixel-panel">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
            <span className="pixel-text-danger">
              {t("inventory.loadError")}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                void overview.refetch();
              }}
              className="pixel-text-xs"
            >
              {t("inventory.retry")}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {showLoading ? (
        <Card className="pixel-panel border-dashed">
          <CardContent className="animate-pulse space-y-2 p-6 text-sm">
            <div className="bg-muted h-4 w-1/3 rounded" />
            <div className="bg-muted h-4 w-2/3 rounded" />
            <div className="bg-muted h-20 rounded" />
          </CardContent>
        </Card>
      ) : null}

      {!showLoading &&
      !overview.isFetching &&
      !overview.isError &&
      items.length === 0 ? (
        <Card className="pixel-panel">
          <CardContent className="pixel-text-muted p-6 text-sm">
            {t("inventory.empty")}
          </CardContent>
        </Card>
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

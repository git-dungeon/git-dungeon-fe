import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { InventoryLayout } from "@/widgets/inventory/ui/inventory-layout";
import { useInventoryActions } from "@/features/inventory/model/use-inventory-actions";
import { useCharacterOverview } from "@/features/character-summary/model/use-character-overview";
import { useTranslation } from "react-i18next";

export function InventoryPage() {
  const { t } = useTranslation();
  const overview = useCharacterOverview();
  const actions = useInventoryActions();

  const inventoryData = overview.inventory.data;
  const items = inventoryData?.items ?? [];
  const showLoading = overview.isLoading && !inventoryData;

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-foreground text-2xl font-semibold">
          {t("inventory.title")}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t("inventory.subtitle")}
        </p>
      </header>

      {overview.isError ? (
        <Card className="border-destructive/30">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
            <span className="text-destructive">{t("inventory.loadError")}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                void overview.refetch();
              }}
              className="text-xs"
            >
              {t("inventory.retry")}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {showLoading ? (
        <Card className="border-dashed">
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
        <Card>
          <CardContent className="text-muted-foreground p-6 text-sm">
            {t("inventory.empty")}
          </CardContent>
        </Card>
      ) : null}

      {inventoryData && overview.data ? (
        <InventoryLayout
          items={inventoryData.items}
          equipped={inventoryData.equipped}
          stats={overview.data.stats}
          isPending={actions.isPending}
          error={actions.error}
          onEquip={actions.equip}
          onUnequip={actions.unequip}
          onDiscard={actions.discard}
        />
      ) : null}
    </section>
  );
}

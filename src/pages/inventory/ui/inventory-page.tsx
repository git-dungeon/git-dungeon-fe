import { useInventory } from "@/entities/inventory/model/use-inventory";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { InventoryLayout } from "@/widgets/inventory/ui/inventory-layout";
import { useInventoryActions } from "@/features/inventory/model/use-inventory-actions";

export function InventoryPage() {
  const { data, isLoading, isError, refetch, isFetching } = useInventory();
  const actions = useInventoryActions();

  const showLoading = isLoading && !data;
  const items = data?.items ?? [];

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-foreground text-2xl font-semibold">인벤토리</h1>
        <p className="text-muted-foreground text-sm">
          현재 유저가 가지고 있는 아이템 목록입니다.
        </p>
      </header>

      {isError ? (
        <Card className="border-destructive/30">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
            <span className="text-destructive">
              인벤토리를 불러오는 중 문제가 발생했습니다.
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                void refetch();
              }}
              className="text-xs"
            >
              다시 시도
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

      {!showLoading && !isFetching && items.length === 0 ? (
        <Card>
          <CardContent className="text-muted-foreground p-6 text-sm">
            아직 획득한 장비가 없습니다.
          </CardContent>
        </Card>
      ) : null}

      {data ? (
        <InventoryLayout
          items={data.items}
          equipped={data.equipped}
          summary={data.summary}
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

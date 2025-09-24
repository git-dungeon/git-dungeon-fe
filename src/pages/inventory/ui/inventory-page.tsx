import { useInventory } from "@/entities/inventory/model/use-inventory";
import { InventoryItems } from "@/widgets/inventory-items/ui/inventory-items";
import { Card, CardContent } from "@/shared/ui/card";

export function InventoryPage() {
  const { data, isLoading, isError, refetch, isFetching } = useInventory();

  const items = data?.items ?? [];
  const showLoading = isLoading && !data;

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-foreground text-2xl font-semibold">인벤토리</h1>
        <p className="text-muted-foreground text-sm">
          보유 중인 장비를 확인하고 장착을 변경하세요.
        </p>
      </header>

      {isError ? (
        <Card className="border-destructive/30">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
            <span className="text-destructive">
              인벤토리를 불러오는 중 문제가 발생했습니다.
            </span>
            <button
              type="button"
              onClick={() => {
                void refetch();
              }}
              className="border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex items-center rounded-md border px-3 py-1 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              다시 시도
            </button>
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

      {items.length > 0 ? <InventoryItems items={items} /> : null}
    </section>
  );
}

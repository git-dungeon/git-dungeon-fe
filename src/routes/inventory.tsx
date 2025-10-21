import { createFileRoute } from "@tanstack/react-router";
import { inventoryQueryOptions } from "@/entities/inventory/model/inventory-query";
import { InventoryPage } from "@/pages/inventory/ui/inventory-page";
import { ensureQueryDataSafe } from "@/shared/lib/query/ensure-query-data-safe";

export const Route = createFileRoute("/inventory")({
  beforeLoad: ({ context, location }) => context.auth.authorize({ location }),
  loader: async ({ context }) => {
    await context.auth.ensureSession();
    await ensureQueryDataSafe(context.queryClient, inventoryQueryOptions);
  },
  component: InventoryRoute,
});

function InventoryRoute() {
  return <InventoryPage />;
}

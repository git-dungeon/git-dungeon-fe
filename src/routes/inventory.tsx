import { createFileRoute } from "@tanstack/react-router";
import { inventoryQueryOptions } from "@/entities/inventory/model/inventory-query";
import { InventoryPage } from "@/pages/inventory/ui/inventory-page";
import { ensureOnboardingComplete } from "@/shared/lib/navigation/ensure-onboarding-complete";
import { ensureQueryDataSafe } from "@/shared/lib/query/ensure-query-data-safe";

export const Route = createFileRoute("/inventory")({
  beforeLoad: async ({ context, location }) => {
    await context.auth.authorize({ location });
    await ensureOnboardingComplete(context.queryClient);
  },
  loader: async ({ context }) => {
    await context.auth.ensureSession();
    await ensureQueryDataSafe(context.queryClient, inventoryQueryOptions);
  },
  component: InventoryRoute,
});

function InventoryRoute() {
  return <InventoryPage />;
}

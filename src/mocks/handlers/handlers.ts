import { authHandlers } from "./auth-handlers";
import { dashboardHandlers } from "./dashboard-handlers";
import { inventoryHandlers } from "./inventory-handlers";

export const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...inventoryHandlers,
];

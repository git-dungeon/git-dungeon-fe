import { authHandlers } from "./auth-handlers";
import { dashboardHandlers } from "./dashboard-handlers";
import { inventoryHandlers } from "./inventory-handlers";
import { dungeonLogHandlers } from "./dungeon-log-handlers";

export const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...dungeonLogHandlers,
  ...inventoryHandlers,
];

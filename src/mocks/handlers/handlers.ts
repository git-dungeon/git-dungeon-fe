import { authHandlers } from "./auth-handlers";
import { dashboardHandlers } from "./dashboard-handlers";
import { dungeonLogHandlers } from "./dungeon-log-handlers";
import { inventoryHandlers } from "./inventory-handlers";
import { settingsHandlers } from "./settings-handlers";

export const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...dungeonLogHandlers,
  ...inventoryHandlers,
  ...settingsHandlers,
];

import { authHandlers } from "./auth-handlers";
import { dashboardHandlers } from "./dashboard-handlers";
import { logsHandlers } from "./logs-handlers";
import { inventoryHandlers } from "./inventory-handlers";
import { settingsHandlers } from "./settings-handlers";
import { embedHandlers } from "./embed-handlers";
import { catalogHandlers } from "./catalog-handlers";
import { githubHandlers } from "./github-handlers";
import { rankingHandlers } from "./ranking-handlers";
import { levelUpHandlers } from "./level-up-handlers";
import { chestHandlers } from "./chest-handlers";

export const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...logsHandlers,
  ...inventoryHandlers,
  ...settingsHandlers,
  ...catalogHandlers,
  ...githubHandlers,
  ...embedHandlers,
  ...rankingHandlers,
  ...levelUpHandlers,
  ...chestHandlers,
];

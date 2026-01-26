import { authHandlers } from "./auth-handlers";
import { dashboardHandlers } from "./dashboard-handlers";
import { dungeonLogHandlers } from "./dungeon-log-handlers";
import { inventoryHandlers } from "./inventory-handlers";
import { settingsHandlers } from "./settings-handlers";
import { embedHandlers } from "./embed-handlers";
import { catalogHandlers } from "./catalog-handlers";
import { githubHandlers } from "./github-handlers";
import { rankingHandlers } from "./ranking-handlers";
import { levelUpHandlers } from "./level-up-handlers";

export const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...dungeonLogHandlers,
  ...inventoryHandlers,
  ...settingsHandlers,
  ...catalogHandlers,
  ...githubHandlers,
  ...embedHandlers,
  ...rankingHandlers,
  ...levelUpHandlers,
];

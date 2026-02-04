import type { CatalogData } from "@/entities/catalog/model/types";
import {
  MOCK_CATALOG_DISMANTLE_CONFIG,
  MOCK_CATALOG_ENHANCEMENT_CONFIG,
} from "@/mocks/handlers/catalog-handlers";

export function createMockCatalogData(
  partial?: Partial<CatalogData>
): CatalogData {
  const now = new Date().toISOString();

  return {
    version: 1,
    updatedAt: now,
    items: [],
    buffs: [],
    monsters: [],
    enhancement: MOCK_CATALOG_ENHANCEMENT_CONFIG,
    dismantle: MOCK_CATALOG_DISMANTLE_CONFIG,
    assetsBaseUrl: null,
    spriteMap: null,
    ...partial,
  };
}

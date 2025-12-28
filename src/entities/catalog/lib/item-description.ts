import type { CatalogData } from "@/entities/catalog/model/types";

export interface CatalogItemDescription {
  description: string | null;
  descriptionKey: string | null;
}

export function buildCatalogItemDescriptionMap(
  catalog?: CatalogData | null
): Map<string, CatalogItemDescription> {
  const map = new Map<string, CatalogItemDescription>();

  if (!catalog) {
    return map;
  }

  for (const item of catalog.items) {
    map.set(item.code, {
      description: item.description,
      descriptionKey: item.descriptionKey,
    });
  }

  return map;
}

export function resolveCatalogItemDescription(
  map: Map<string, CatalogItemDescription>,
  code: string
): CatalogItemDescription | null {
  return map.get(code) ?? null;
}

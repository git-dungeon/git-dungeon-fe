import type { CatalogData } from "@/entities/catalog/model/types";

export function buildCatalogItemNameMap(
  catalog?: CatalogData | null
): Map<string, string> {
  const map = new Map<string, string>();

  if (!catalog) {
    return map;
  }

  for (const item of catalog.items) {
    map.set(item.code, item.name);
  }

  return map;
}

export function resolveCatalogItemName(
  map: Map<string, string>,
  code: string,
  fallback?: string | null
): string {
  return map.get(code) ?? fallback ?? code;
}

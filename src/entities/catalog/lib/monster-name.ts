import type { CatalogData } from "@/entities/catalog/model/types";

const MONSTER_PREFIX = "monster-";

export function buildCatalogMonsterNameMap(
  catalog?: CatalogData | null
): Map<string, string> {
  const map = new Map<string, string>();

  if (!catalog) {
    return map;
  }

  for (const monster of catalog.monsters) {
    map.set(monster.code, monster.name);
    if (monster.code.startsWith(MONSTER_PREFIX)) {
      map.set(monster.code.slice(MONSTER_PREFIX.length), monster.name);
    }
  }

  return map;
}

export function resolveCatalogMonsterName(
  map: Map<string, string>,
  code: string,
  fallback?: string | null
): string {
  return (
    map.get(code) ?? map.get(normalizeMonsterCode(code)) ?? fallback ?? code
  );
}

function normalizeMonsterCode(code: string) {
  return code.startsWith(MONSTER_PREFIX)
    ? code.slice(MONSTER_PREFIX.length)
    : `${MONSTER_PREFIX}${code}`;
}

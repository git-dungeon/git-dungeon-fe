import { useCallback, useMemo } from "react";
import { useCatalog } from "@/entities/catalog/model/use-catalog";
import { useLanguagePreference } from "@/features/settings/model/use-language-preference";
import type { EquipmentRarity } from "@/entities/inventory/model/types";

export function useCatalogItemRarityResolver() {
  const { language } = useLanguagePreference();
  const catalogQuery = useCatalog(language);
  const rarityMap = useMemo(() => {
    const map = new Map<string, EquipmentRarity>();
    const catalog = catalogQuery.data;

    if (!catalog) {
      return map;
    }

    for (const item of catalog.items) {
      map.set(item.code, item.rarity as EquipmentRarity);
    }

    return map;
  }, [catalogQuery.data]);

  return useCallback(
    (code: string) => rarityMap.get(code) ?? null,
    [rarityMap]
  );
}

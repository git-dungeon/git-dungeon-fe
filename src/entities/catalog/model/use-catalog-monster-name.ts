import { useCallback, useMemo } from "react";
import { useCatalog } from "@/entities/catalog/model/use-catalog";
import { useLanguagePreference } from "@/features/settings/model/use-language-preference";
import {
  buildCatalogMonsterNameMap,
  resolveCatalogMonsterName,
} from "@/entities/catalog/lib/monster-name";

export function useCatalogMonsterNameResolver() {
  const { language } = useLanguagePreference();
  const catalogQuery = useCatalog(language);
  const nameMap = useMemo(
    () => buildCatalogMonsterNameMap(catalogQuery.data),
    [catalogQuery.data]
  );

  return useCallback(
    (code: string, fallback?: string | null) =>
      resolveCatalogMonsterName(nameMap, code, fallback),
    [nameMap]
  );
}

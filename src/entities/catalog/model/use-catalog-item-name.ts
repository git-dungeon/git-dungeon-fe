import { useCallback, useMemo } from "react";
import { useCatalog } from "@/entities/catalog/model/use-catalog";
import { useLanguagePreference } from "@/features/settings/model/use-language-preference";
import {
  buildCatalogItemNameMap,
  resolveCatalogItemName,
} from "@/entities/catalog/lib/item-name";

export function useCatalogItemNameResolver() {
  const { language } = useLanguagePreference();
  const catalogQuery = useCatalog(language);
  const nameMap = useMemo(
    () => buildCatalogItemNameMap(catalogQuery.data),
    [catalogQuery.data]
  );

  return useCallback(
    (code: string, fallback?: string | null) =>
      resolveCatalogItemName(nameMap, code, fallback),
    [nameMap]
  );
}

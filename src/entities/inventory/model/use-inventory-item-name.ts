import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useCatalogItemNameResolver } from "@/entities/catalog/model/use-catalog-item-name";

export function useInventoryItemNameResolver() {
  const resolveCatalogName = useCatalogItemNameResolver();
  const { t } = useTranslation();

  return useCallback(
    (code: string, fallback?: string | null) => {
      const resolved = resolveCatalogName(code, fallback);
      if (resolved !== code) {
        return resolved;
      }

      const key = `inventory.items.${code}`;
      const localized = t(key);
      return localized === key ? resolved : localized;
    },
    [resolveCatalogName, t]
  );
}

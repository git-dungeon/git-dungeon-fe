import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useCatalog } from "@/entities/catalog/model/use-catalog";
import { useLanguagePreference } from "@/features/settings/model/use-language-preference";
import {
  buildCatalogItemDescriptionMap,
  resolveCatalogItemDescription,
} from "@/entities/catalog/lib/item-description";

export function useCatalogItemDescriptionResolver() {
  const { t, i18n } = useTranslation();
  const { language } = useLanguagePreference();
  const catalogQuery = useCatalog(language);
  const descriptionMap = useMemo(
    () => buildCatalogItemDescriptionMap(catalogQuery.data),
    [catalogQuery.data]
  );

  return useCallback(
    (code: string): string | null => {
      const desc = resolveCatalogItemDescription(descriptionMap, code);
      if (!desc) {
        return null;
      }

      // descriptionKey 우선, 없으면 description fallback
      if (desc.descriptionKey && i18n.exists(desc.descriptionKey)) {
        return t(desc.descriptionKey);
      }

      return desc.description;
    },
    [descriptionMap, t]
  );
}

import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useCatalog } from "@/entities/catalog/model/use-catalog";
import { useLanguagePreference } from "@/features/settings/model/use-language-preference";
import {
  buildCatalogItemDescriptionMap,
  resolveCatalogItemDescription,
} from "@/entities/catalog/lib/item-description";

export function useCatalogItemDescriptionResolver() {
  const { t } = useTranslation();
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
      if (desc.descriptionKey) {
        const translated = t(desc.descriptionKey);
        // 번역이 없으면 (키가 그대로 반환되면) description 사용
        if (translated !== desc.descriptionKey) {
          return translated;
        }
      }

      return desc.description;
    },
    [descriptionMap, t]
  );
}

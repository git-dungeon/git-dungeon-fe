import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import ko from "./locales/ko.json";
import en from "./locales/en.json";
import {
  DEFAULT_LANGUAGE_PREFERENCE,
  LANGUAGE_PREFERENCE_VALUES,
} from "@/shared/lib/preferences/types";
import {
  getLanguagePreference,
  subscribeLanguagePreference,
} from "@/shared/lib/preferences/preferences";
import { queryClient } from "@/shared/lib/query/query-client";
import { CATALOG_QUERY_KEY } from "@/entities/catalog/model/catalog-query";

const resources = {
  ko: { translation: ko },
  en: { translation: en },
} as const;

const isDev = import.meta.env.DEV;

if (!i18next.isInitialized) {
  void i18next.use(initReactI18next).init({
    resources,
    lng: getLanguagePreference(),
    fallbackLng: DEFAULT_LANGUAGE_PREFERENCE,
    supportedLngs: LANGUAGE_PREFERENCE_VALUES,
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
    saveMissing: isDev,
    missingKeyHandler: isDev
      ? (lngs, namespace, key) => {
          const languages = Array.isArray(lngs) ? lngs.join(", ") : lngs;
          console.warn(
            `[i18n] Missing translation key: ${namespace}:${key} (lng: ${languages})`
          );
        }
      : undefined,
  });
}

const unsubscribeLanguagePreference = subscribeLanguagePreference(() => {
  const nextLanguage = getLanguagePreference();
  if (i18next.language !== nextLanguage) {
    void i18next.changeLanguage(nextLanguage);
    queryClient.invalidateQueries({ queryKey: CATALOG_QUERY_KEY });
  }
});

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    unsubscribeLanguagePreference();
  });
}

export { i18next };

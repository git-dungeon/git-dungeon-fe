import { useCallback, useSyncExternalStore } from "react";
import {
  getLanguagePreference,
  setLanguagePreference,
  subscribeLanguagePreference,
} from "@/shared/lib/preferences/preferences";
import type { LanguagePreference } from "@/shared/lib/preferences/types";

export function useLanguagePreference() {
  const language = useSyncExternalStore(
    subscribeLanguagePreference,
    getLanguagePreference,
    getLanguagePreference
  );

  const setLanguage = useCallback((next: LanguagePreference) => {
    setLanguagePreference(next);
  }, []);

  return {
    language,
    setLanguage,
  } as const;
}

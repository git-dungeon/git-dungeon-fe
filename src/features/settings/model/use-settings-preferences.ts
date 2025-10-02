import { useMemo } from "react";
import { useLanguagePreference } from "@/features/settings/model/use-language-preference";
import { useThemePreference } from "@/features/settings/model/use-theme-preference";

export function useSettingsPreferences() {
  const { theme, setTheme } = useThemePreference();
  const { language, setLanguage } = useLanguagePreference();

  return useMemo(
    () => ({
      theme,
      setTheme,
      language,
      setLanguage,
    }),
    [language, setLanguage, setTheme, theme]
  );
}

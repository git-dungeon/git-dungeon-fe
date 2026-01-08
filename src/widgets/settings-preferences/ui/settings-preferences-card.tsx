import { PixelPanel } from "@/shared/ui/pixel-panel";
import { useSettingsPreferences } from "@/features/settings/model/use-settings-preferences";
import { PreferencesForm } from "@/features/settings/ui/preferences-form";
import { useTranslation } from "react-i18next";

export function SettingsPreferencesCard() {
  const { t } = useTranslation();
  const { theme, setTheme, language, setLanguage } = useSettingsPreferences();

  return (
    <PixelPanel
      title={t("settings.preferences.title")}
      className="p-4"
      contentClassName="space-y-6"
    >
      <p className="pixel-text-muted pixel-text-sm">
        {t("settings.preferences.description")}
      </p>
      <PreferencesForm
        theme={theme}
        language={language}
        onThemeChange={setTheme}
        onLanguageChange={setLanguage}
      />
    </PixelPanel>
  );
}

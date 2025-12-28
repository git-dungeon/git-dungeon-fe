import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { useSettingsPreferences } from "@/features/settings/model/use-settings-preferences";
import { PreferencesForm } from "@/features/settings/ui/preferences-form";
import { useTranslation } from "react-i18next";

export function SettingsPreferencesCard() {
  const { t } = useTranslation();
  const { theme, setTheme, language, setLanguage } = useSettingsPreferences();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.preferences.title")}</CardTitle>
        <CardDescription>
          {t("settings.preferences.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PreferencesForm
          theme={theme}
          language={language}
          onThemeChange={setTheme}
          onLanguageChange={setLanguage}
        />
      </CardContent>
    </Card>
  );
}

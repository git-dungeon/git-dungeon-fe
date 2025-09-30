import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { useSettingsPreferences } from "@/features/settings/model/use-settings-preferences";
import { PreferencesForm } from "@/features/settings/ui/preferences-form";

export function SettingsPreferencesCard() {
  const { theme, setTheme, language, setLanguage } = useSettingsPreferences();

  return (
    <Card>
      <CardHeader>
        <CardTitle>환경 설정</CardTitle>
        <CardDescription>테마와 언어를 관리합니다.</CardDescription>
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

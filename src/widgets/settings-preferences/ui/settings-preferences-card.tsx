import { useCallback, type ChangeEvent } from "react";
import { useSettingsPreferences } from "@/features/settings/model/use-settings-preferences";
import type {
  LanguagePreference,
  ThemePreference,
} from "@/shared/lib/preferences/types";
import {
  LANGUAGE_PREFERENCE_VALUES,
  THEME_PREFERENCE_VALUES,
} from "@/shared/lib/preferences/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

const THEME_LABEL_MAP: Record<ThemePreference, string> = {
  system: "시스템 기본값",
  light: "라이트",
  dark: "다크",
};

const LANGUAGE_LABEL_MAP: Record<LanguagePreference, string> = {
  ko: "한국어",
  en: "English",
};

export function SettingsPreferencesCard() {
  const { theme, setTheme, language, setLanguage } = useSettingsPreferences();

  const handleThemeChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      setTheme(event.target.value as ThemePreference);
    },
    [setTheme]
  );

  const handleLanguageChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      setLanguage(event.target.value as LanguagePreference);
    },
    [setLanguage]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>환경 설정</CardTitle>
        <CardDescription>테마와 언어를 관리합니다.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Fieldset
          label="테마"
          controlId="settings-theme"
          control={
            <div className="flex items-center gap-3">
              <select
                id="settings-theme"
                name="theme"
                className="bg-background text-foreground focus-visible:ring-ring focus-visible:ring-offset-background inline-flex h-10 flex-1 items-center rounded-md border px-3 text-sm shadow-sm"
                value={theme}
                onChange={handleThemeChange}
              >
                {THEME_PREFERENCE_VALUES.map((preference) => (
                  <option key={preference} value={preference}>
                    {THEME_LABEL_MAP[preference]}
                  </option>
                ))}
              </select>
            </div>
          }
        />

        <Fieldset
          label="언어"
          controlId="settings-language"
          control={
            <div className="flex items-center gap-3">
              <select
                id="settings-language"
                name="language"
                className="bg-background text-foreground focus-visible:ring-ring focus-visible:ring-offset-background inline-flex h-10 flex-1 items-center rounded-md border px-3 text-sm shadow-sm"
                value={language}
                onChange={handleLanguageChange}
              >
                {LANGUAGE_PREFERENCE_VALUES.map((preference) => (
                  <option key={preference} value={preference}>
                    {LANGUAGE_LABEL_MAP[preference]}
                  </option>
                ))}
              </select>
            </div>
          }
        />
      </CardContent>
    </Card>
  );
}

interface FieldsetProps {
  label: string;
  controlId: string;
  description?: string;
  control: React.ReactNode;
}

function Fieldset({ label, description, controlId, control }: FieldsetProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      <label
        htmlFor={controlId}
        className="text-foreground text-sm font-medium"
      >
        {label}
      </label>
      {control}
      <p className="text-muted-foreground text-xs">{description}</p>
    </fieldset>
  );
}

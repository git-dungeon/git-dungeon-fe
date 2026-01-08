import type {
  LanguagePreference,
  ThemePreference,
} from "@/shared/lib/preferences/types";
import {
  LANGUAGE_PREFERENCE_VALUES,
  THEME_PREFERENCE_VALUES,
} from "@/shared/lib/preferences/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useTranslation } from "react-i18next";

interface PreferencesFormProps {
  theme: ThemePreference;
  language: LanguagePreference;
  onThemeChange: (preference: ThemePreference) => void;
  onLanguageChange: (preference: LanguagePreference) => void;
}

export function PreferencesForm({
  theme,
  language,
  onThemeChange,
  onLanguageChange,
}: PreferencesFormProps) {
  const { t } = useTranslation();
  const themeLabelMap: Record<ThemePreference, string> = {
    system: t("settings.preferences.theme.system"),
    light: t("settings.preferences.theme.light"),
    dark: t("settings.preferences.theme.dark"),
  };
  const languageLabelMap: Record<LanguagePreference, string> = {
    ko: t("settings.preferences.language.ko"),
    en: t("settings.preferences.language.en"),
  };

  return (
    <div className="space-y-6">
      <Fieldset label={t("settings.preferences.theme.label")}>
        <Select value={theme} onValueChange={onThemeChange}>
          <SelectTrigger id="settings-theme" className="pixel-select-trigger">
            <SelectValue
              placeholder={t("settings.preferences.theme.placeholder")}
            />
          </SelectTrigger>
          <SelectContent className="pixel-select-content">
            {THEME_PREFERENCE_VALUES.map((preference) => (
              <SelectItem
                key={preference}
                value={preference}
                className="pixel-select-item"
              >
                {themeLabelMap[preference]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Fieldset>

      <Fieldset label={t("settings.preferences.language.label")}>
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger
            id="settings-language"
            className="pixel-select-trigger"
          >
            <SelectValue
              placeholder={t("settings.preferences.language.placeholder")}
            />
          </SelectTrigger>
          <SelectContent className="pixel-select-content">
            {LANGUAGE_PREFERENCE_VALUES.map((preference) => (
              <SelectItem
                key={preference}
                value={preference}
                className="pixel-select-item"
              >
                {languageLabelMap[preference]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Fieldset>
    </div>
  );
}

interface FieldsetProps {
  label: string;
  children: React.ReactNode;
}

function Fieldset({ label, children }: FieldsetProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="pixel-text-base pixel-text-sm font-medium">
        {label}
      </legend>
      {children}
    </fieldset>
  );
}

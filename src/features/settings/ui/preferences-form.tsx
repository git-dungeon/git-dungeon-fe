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

const THEME_LABEL_MAP: Record<ThemePreference, string> = {
  system: "시스템 기본값",
  light: "라이트",
  dark: "다크",
};

const LANGUAGE_LABEL_MAP: Record<LanguagePreference, string> = {
  ko: "한국어",
  en: "English",
};

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
  return (
    <div className="space-y-6">
      <Fieldset label="테마">
        <Select value={theme} onValueChange={onThemeChange}>
          <SelectTrigger id="settings-theme">
            <SelectValue placeholder="테마를 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {THEME_PREFERENCE_VALUES.map((preference) => (
              <SelectItem key={preference} value={preference}>
                {THEME_LABEL_MAP[preference]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Fieldset>

      <Fieldset label="언어">
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger id="settings-language">
            <SelectValue placeholder="언어를 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGE_PREFERENCE_VALUES.map((preference) => (
              <SelectItem key={preference} value={preference}>
                {LANGUAGE_LABEL_MAP[preference]}
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
      <legend className="text-foreground text-sm font-medium">{label}</legend>
      {children}
    </fieldset>
  );
}

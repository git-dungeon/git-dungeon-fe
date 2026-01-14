import type { LanguagePreference } from "@/shared/lib/preferences/types";
import { LANGUAGE_PREFERENCE_VALUES } from "@/shared/lib/preferences/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";

interface LanguageSelectProps {
  value: LanguagePreference;
  onChange: (preference: LanguagePreference) => void;
  triggerId?: string;
  className?: string;
  ariaLabel?: string;
}

export function LanguageSelect({
  value,
  onChange,
  triggerId,
  className,
  ariaLabel,
}: LanguageSelectProps) {
  const { t } = useTranslation();
  const languageLabelMap: Record<LanguagePreference, string> = {
    ko: t("settings.preferences.language.ko"),
    en: t("settings.preferences.language.en"),
  };

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        id={triggerId}
        aria-label={ariaLabel}
        className={cn("pixel-select-trigger", className)}
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
  );
}

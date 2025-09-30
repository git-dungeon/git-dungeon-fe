export const THEME_PREFERENCE_VALUES = ["system", "light", "dark"] as const;

export type ThemePreference = (typeof THEME_PREFERENCE_VALUES)[number];

export const LANGUAGE_PREFERENCE_VALUES = ["ko", "en"] as const;

export type LanguagePreference = (typeof LANGUAGE_PREFERENCE_VALUES)[number];

export const DEFAULT_THEME_PREFERENCE: ThemePreference = "system";

export const DEFAULT_LANGUAGE_PREFERENCE: LanguagePreference = "ko";

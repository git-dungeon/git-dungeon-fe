import {
  DEFAULT_LANGUAGE_PREFERENCE,
  DEFAULT_THEME_PREFERENCE,
  LANGUAGE_PREFERENCE_VALUES,
  THEME_PREFERENCE_VALUES,
  type LanguagePreference,
  type ThemePreference,
} from "@/shared/lib/preferences/types";

const STORAGE_KEYS = {
  theme: "git-dungeon:theme",
  language: "git-dungeon:language",
} as const;

type ThemeSubscriber = () => void;
type LanguageSubscriber = () => void;

const themeSubscribers = new Set<ThemeSubscriber>();
const languageSubscribers = new Set<LanguageSubscriber>();

let themePreference: ThemePreference = DEFAULT_THEME_PREFERENCE;
let languagePreference: LanguagePreference = DEFAULT_LANGUAGE_PREFERENCE;

const isBrowserEnvironment = typeof window !== "undefined";

function safeReadStorage(key: string): string | null {
  if (!isBrowserEnvironment) {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeWriteStorage(key: string, value: string) {
  if (!isBrowserEnvironment) {
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore write failures (private mode, quota, etc.)
  }
}

function parseThemePreference(raw: string | null): ThemePreference | null {
  if (!raw) {
    return null;
  }

  return THEME_PREFERENCE_VALUES.includes(raw as ThemePreference)
    ? (raw as ThemePreference)
    : null;
}

function parseLanguagePreference(
  raw: string | null
): LanguagePreference | null {
  if (!raw) {
    return null;
  }

  return LANGUAGE_PREFERENCE_VALUES.includes(raw as LanguagePreference)
    ? (raw as LanguagePreference)
    : null;
}

function notifyThemeSubscribers() {
  themeSubscribers.forEach((listener) => {
    listener();
  });
}

function notifyLanguageSubscribers() {
  languageSubscribers.forEach((listener) => {
    listener();
  });
}

function resolveTheme(preference: ThemePreference): "light" | "dark" {
  if (!isBrowserEnvironment) {
    return preference === "dark" ? "dark" : "light";
  }

  if (preference === "system") {
    try {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } catch {
      return "light";
    }
  }

  return preference;
}

function applyThemeToDocument(preference: ThemePreference) {
  if (!isBrowserEnvironment) {
    return;
  }

  const mode = resolveTheme(preference);
  const root = document.documentElement;

  if (mode === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

function applyLanguageToDocument(preference: LanguagePreference) {
  if (!isBrowserEnvironment) {
    return;
  }

  document.documentElement.lang = preference;
}

function initializePreferences() {
  const storedTheme = parseThemePreference(safeReadStorage(STORAGE_KEYS.theme));
  const storedLanguage = parseLanguagePreference(
    safeReadStorage(STORAGE_KEYS.language)
  );

  if (storedTheme) {
    themePreference = storedTheme;
  }

  if (storedLanguage) {
    languagePreference = storedLanguage;
  }

  applyThemeToDocument(themePreference);
  applyLanguageToDocument(languagePreference);
}

function handleStorageEvent(event: StorageEvent) {
  if (!event.key) {
    return;
  }

  if (event.key === STORAGE_KEYS.theme) {
    const parsed =
      parseThemePreference(event.newValue) ?? DEFAULT_THEME_PREFERENCE;
    if (parsed !== themePreference) {
      themePreference = parsed;
      applyThemeToDocument(themePreference);
      notifyThemeSubscribers();
    }
  }

  if (event.key === STORAGE_KEYS.language) {
    const parsed =
      parseLanguagePreference(event.newValue) ?? DEFAULT_LANGUAGE_PREFERENCE;
    if (parsed !== languagePreference) {
      languagePreference = parsed;
      applyLanguageToDocument(languagePreference);
      notifyLanguageSubscribers();
    }
  }
}

function handleSystemThemeChange() {
  if (themePreference === "system") {
    applyThemeToDocument(themePreference);
    notifyThemeSubscribers();
  }
}

function bindBrowserListeners() {
  if (!isBrowserEnvironment) {
    return;
  }

  window.addEventListener("storage", handleStorageEvent);

  try {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", handleSystemThemeChange);
    } else if (typeof media.addListener === "function") {
      media.addListener(handleSystemThemeChange);
    }
  } catch {
    // matchMedia may be unsupported; ignore silently
  }
}

if (isBrowserEnvironment) {
  initializePreferences();
  bindBrowserListeners();
}

export function getThemePreference(): ThemePreference {
  return themePreference;
}

export function setThemePreference(next: ThemePreference) {
  if (next === themePreference) {
    applyThemeToDocument(next);
    return;
  }

  themePreference = next;
  safeWriteStorage(STORAGE_KEYS.theme, next);
  applyThemeToDocument(themePreference);
  notifyThemeSubscribers();
}

export function subscribeThemePreference(
  listener: ThemeSubscriber
): () => void {
  themeSubscribers.add(listener);
  return () => {
    themeSubscribers.delete(listener);
  };
}

export function resolveThemePreference(
  preference: ThemePreference
): "light" | "dark" {
  return resolveTheme(preference);
}

export function getLanguagePreference(): LanguagePreference {
  return languagePreference;
}

export function setLanguagePreference(next: LanguagePreference) {
  if (next === languagePreference) {
    return;
  }

  languagePreference = next;
  safeWriteStorage(STORAGE_KEYS.language, next);
  applyLanguageToDocument(languagePreference);
  notifyLanguageSubscribers();
}

export function subscribeLanguagePreference(
  listener: LanguageSubscriber
): () => void {
  languageSubscribers.add(listener);
  return () => {
    languageSubscribers.delete(listener);
  };
}

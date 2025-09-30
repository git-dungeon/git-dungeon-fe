import { useCallback, useSyncExternalStore } from "react";
import {
  getThemePreference,
  setThemePreference,
  subscribeThemePreference,
} from "@/shared/lib/preferences/preferences";
import type { ThemePreference } from "@/shared/lib/preferences/types";

export function useThemePreference() {
  const theme = useSyncExternalStore(
    subscribeThemePreference,
    getThemePreference,
    getThemePreference
  );

  const setTheme = useCallback((next: ThemePreference) => {
    setThemePreference(next);
  }, []);

  return {
    theme,
    setTheme,
  } as const;
}

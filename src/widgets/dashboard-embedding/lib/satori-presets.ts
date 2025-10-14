import type {
  EmbedPreviewLanguage,
  EmbedPreviewSize,
  EmbedPreviewTheme,
} from "@/entities/embed/model/types";

export interface EmbedSatoriSizePreset {
  width: number;
  paddingX: number;
  paddingY: number;
  height: number;
  headerColumns: number;
  statsColumns: number;
  equipmentColumns: number;
}

export const EMBED_SATORI_SIZE_PRESETS: Record<
  EmbedPreviewSize,
  EmbedSatoriSizePreset
> = {
  compact: {
    width: 480,
    paddingX: 24,
    paddingY: 24,
    height: 640,
    headerColumns: 1,
    statsColumns: 1,
    equipmentColumns: 1,
  },
  square: {
    width: 720,
    paddingX: 28,
    paddingY: 32,
    height: 760,
    headerColumns: 2,
    statsColumns: 2,
    equipmentColumns: 2,
  },
  wide: {
    width: 960,
    paddingX: 40,
    paddingY: 40,
    height: 680,
    headerColumns: 4,
    statsColumns: 2,
    equipmentColumns: 2,
  },
};

interface EmbedSatoriPalette {
  background: string;
  backgroundAccent: string;
  foreground: string;
  mutedForeground: string;
  cardBackground: string;
  border: string;
  secondary: string;
  danger: string;
}

const LIGHT_PALETTE: EmbedSatoriPalette = {
  background: "#ffffff",
  backgroundAccent: "#f4f4f5",
  foreground: "#111827",
  mutedForeground: "#6b7280",
  cardBackground: "#ffffff",
  border: "#e5e7eb",
  secondary: "#f3f4f6",
  danger: "#ef4444",
};

const DARK_PALETTE: EmbedSatoriPalette = {
  background: "#111827",
  backgroundAccent: "#1f2937",
  foreground: "#f9fafb",
  mutedForeground: "#9ca3af",
  cardBackground: "#1f2937",
  border: "#374151",
  secondary: "#111827",
  danger: "#f87171",
};

export const EMBED_SATORI_PALETTES: Record<
  EmbedPreviewTheme,
  EmbedSatoriPalette
> = {
  light: LIGHT_PALETTE,
  dark: DARK_PALETTE,
};

interface EmbedSatoriLocaleStrings {
  level: string;
  exp: string;
  floorProgress: string;
  gold: string;
  ap: string;
  stats: string;
  equipment: string;
  equipmentEmpty: string;
}

const KO_STRINGS: EmbedSatoriLocaleStrings = {
  level: "레벨",
  exp: "경험치",
  floorProgress: "층 진행",
  gold: "골드",
  ap: "AP",
  stats: "능력치",
  equipment: "착용 장비",
  equipmentEmpty: "장비 없음",
};

const EN_STRINGS: EmbedSatoriLocaleStrings = {
  level: "Level",
  exp: "Experience",
  floorProgress: "Floor Progress",
  gold: "Gold",
  ap: "AP",
  stats: "Stats",
  equipment: "Equipment",
  equipmentEmpty: "No Equipment",
};

export const EMBED_SATORI_LOCALE_STRINGS: Record<
  EmbedPreviewLanguage,
  EmbedSatoriLocaleStrings
> = {
  ko: KO_STRINGS,
  en: EN_STRINGS,
};

export interface EmbedSatoriConfig {
  size: EmbedPreviewSize;
  theme: EmbedPreviewTheme;
  language: EmbedPreviewLanguage;
}

export const EMBED_SATORI_DEFAULT_FONT_FAMILY =
  "'Inter', 'Pretendard', 'Noto Sans KR', 'Arial', sans-serif";

export function resolveEmbedSatoriPalette(theme: EmbedPreviewTheme) {
  return EMBED_SATORI_PALETTES[theme];
}

export function resolveEmbedSatoriPreset(size: EmbedPreviewSize) {
  return EMBED_SATORI_SIZE_PRESETS[size];
}

export function resolveEmbedSatoriStrings(language: EmbedPreviewLanguage) {
  return EMBED_SATORI_LOCALE_STRINGS[language];
}

import type { EmbedPreviewTheme } from "../types";

export interface PixelFontTheme {
  title: string;
  body: string;
}

export interface PixelTheme {
  panelBackground: string;
  panelBorder: string;
  panelShadow: string;
  frameBorder: string;
  frameShadow: string;
  frameInsetShadow: string;
  frameHighlight: string;
  surfaceStrong: string;
  surfaceDeep: string;
  barSurface: string;
  barBorder: string;
  textPrimary: string;
  textMuted: string;
  textShadow: string;
  accent: string;
  hpGradient: string;
  expGradient: string;
  apGradient: string;
  fonts: PixelFontTheme;
  slotPlaceholder: string;
}

const PIXEL_FONTS: PixelFontTheme = {
  title: '"DungGeunMo Bold", "Noto Sans KR", system-ui, sans-serif',
  body: '"DungGeunMo Thin", "Noto Sans KR", system-ui, sans-serif',
};

const LIGHT_THEME: PixelTheme = {
  panelBackground: "linear-gradient(180deg, #dac4a2 0%, #d2b890 100%)",
  panelBorder: "#b08c63",
  panelShadow: "#c2a17a",
  frameBorder: "#4a3524",
  frameShadow: "#8a6a4d",
  frameInsetShadow: "rgba(0, 0, 0, 0.35)",
  frameHighlight: "rgba(255, 255, 255, 0.25)",
  surfaceStrong: "#d4b896",
  surfaceDeep: "#c8a880",
  barSurface: "#e4d5be",
  barBorder: "#bfa583",
  textPrimary: "#fffbf0",
  textMuted: "#e8dcc8",
  textShadow:
    "1px 0 0 #8b6a49, -1px 0 0 #8b6a49, 0 1px 0 #8b6a49, 0 -1px 0 #8b6a49, 1px 1px 0 #8b6a49, -1px 1px 0 #8b6a49, 1px -1px 0 #8b6a49, -1px -1px 0 #8b6a49",
  accent: "#f4c76f",
  hpGradient: "linear-gradient(90deg, #37c86b 0%, #1fa65b 100%)",
  expGradient: "linear-gradient(90deg, #b066f4 0%, #7f4dde 100%)",
  apGradient: "linear-gradient(90deg, #58c2ff 0%, #3284d4 100%)",
  fonts: PIXEL_FONTS,
  slotPlaceholder: "rgba(0, 0, 0, 0.12)",
};

const DARK_THEME: PixelTheme = {
  panelBackground: "#1a1f2c",
  panelBorder: "#3a4153",
  panelShadow: "#0b0f18",
  frameBorder: "#1f2228",
  frameShadow: "#0f1115",
  frameInsetShadow: "rgba(0, 0, 0, 0.4)",
  frameHighlight: "rgba(255, 255, 255, 0.2)",
  surfaceStrong: "#141a26",
  surfaceDeep: "#111623",
  barSurface: "#0f1420",
  barBorder: "#353b4b",
  textPrimary: "#f6f0e1",
  textMuted: "#b4b9c5",
  textShadow:
    "1px 0 0 #0b0b0b, -1px 0 0 #0b0b0b, 0 1px 0 #0b0b0b, 0 -1px 0 #0b0b0b, 1px 1px 0 #0b0b0b, -1px 1px 0 #0b0b0b, 1px -1px 0 #0b0b0b, -1px -1px 0 #0b0b0b",
  accent: "#f4c76f",
  hpGradient: "linear-gradient(90deg, #37c86b 0%, #1fa65b 100%)",
  expGradient: "linear-gradient(90deg, #b066f4 0%, #7f4dde 100%)",
  apGradient: "linear-gradient(90deg, #58c2ff 0%, #3284d4 100%)",
  fonts: PIXEL_FONTS,
  slotPlaceholder: "rgba(255, 255, 255, 0.08)",
};

export function resolvePixelTheme(theme: EmbedPreviewTheme): PixelTheme {
  return theme === "dark" ? DARK_THEME : LIGHT_THEME;
}

import type { CharacterOverview } from "@/features/character-summary/lib/build-character-overview";
import type {
  EmbedPreviewLanguage,
  EmbedPreviewSize,
  EmbedPreviewTheme,
} from "@/entities/embed/model/types";
import {
  renderEmbedSvg,
  type EmbedFontConfig,
} from "@git-dungeon/embed-renderer";
import {
  loadFontsFromUrls,
  type BrowserFontSource,
} from "@git-dungeon/embed-renderer/browser";
import NotoSansKrFontUrl from "@/shared/assets/fonts/NotoSansKR-Regular.otf?url";

interface GenerateEmbedPreviewSvgParams {
  theme: EmbedPreviewTheme;
  size: EmbedPreviewSize;
  language: EmbedPreviewLanguage;
  overview: CharacterOverview;
}

const browserFontSources: BrowserFontSource[] = [
  {
    name: "Noto Sans KR",
    url: NotoSansKrFontUrl,
    weight: 400,
    style: "normal",
  },
];

let cachedFonts: EmbedFontConfig[] | null = null;
let pendingFonts: Promise<EmbedFontConfig[]> | null = null;

async function ensureFonts(): Promise<EmbedFontConfig[]> {
  if (cachedFonts) {
    return cachedFonts;
  }

  if (!pendingFonts) {
    pendingFonts = loadFontsFromUrls(browserFontSources).then(
      (fonts: EmbedFontConfig[]) => {
        cachedFonts = fonts;
        pendingFonts = null;
        return fonts;
      }
    );
  }

  return pendingFonts!;
}

export async function generateEmbedPreviewSvg({
  theme,
  size,
  language,
  overview,
}: GenerateEmbedPreviewSvgParams) {
  try {
    const fonts = await ensureFonts();
    return await renderEmbedSvg({
      theme,
      size,
      language,
      overview,
      fonts,
    });
  } catch (error) {
    if (import.meta.env?.DEV) {
      console.error("[embed-preview] Satori 렌더링 에러", error);
    }
    const message =
      error instanceof Error
        ? `Satori 렌더링 실패: ${error.message}`
        : "Satori 렌더링 중 알 수 없는 오류가 발생했습니다.";

    throw error instanceof Error
      ? Object.assign(error, { message })
      : new Error(message);
  }
}

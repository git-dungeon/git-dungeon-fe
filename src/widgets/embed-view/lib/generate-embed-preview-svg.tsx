import type { CharacterOverview } from "@/features/character-summary/lib/build-character-overview";
import type {
  EmbedPreviewLanguage,
  EmbedPreviewSize,
  EmbedPreviewTheme,
} from "@/entities/embed/model/types";
import { resolveEmbedSatoriPreset } from "@/widgets/dashboard-embedding/lib/satori-presets";
import NotoSansKrFontUrl from "@/shared/assets/fonts/NotoSansKR-Regular.otf?url";
import { DashboardEmbeddingBannerSatori } from "@/widgets/dashboard-embedding/ui/dashboard-embedding-banner-satori";

const DEFAULT_NODE_ENV =
  typeof import.meta !== "undefined" && import.meta.env?.MODE
    ? import.meta.env.MODE
    : "development";

if (typeof globalThis.process === "undefined") {
  Object.defineProperty(globalThis, "process", {
    value: {
      env: {
        NODE_ENV: DEFAULT_NODE_ENV,
      },
    },
  });
} else if (!globalThis.process.env?.NODE_ENV) {
  globalThis.process.env.NODE_ENV = DEFAULT_NODE_ENV;
}

let cachedSatori: typeof import("satori").default | null = null;

const fontDataCache = new Map<string, ArrayBuffer>();
const pendingFontRequests = new Map<string, Promise<ArrayBuffer>>();

async function loadFontData(
  fontUrl: string,
  label: string
): Promise<ArrayBuffer> {
  const cached = fontDataCache.get(fontUrl);
  if (cached) {
    return cached;
  }

  const pending = pendingFontRequests.get(fontUrl);
  if (pending) {
    return pending;
  }

  const request = fetch(fontUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${label} 폰트를 불러오지 못했습니다.`);
      }

      return response.arrayBuffer();
    })
    .then((arrayBuffer) => {
      fontDataCache.set(fontUrl, arrayBuffer);
      pendingFontRequests.delete(fontUrl);
      return arrayBuffer;
    })
    .catch((error) => {
      pendingFontRequests.delete(fontUrl);

      if (error instanceof Error) {
        throw error;
      }

      throw new Error(`${label} 폰트 로딩 중 알 수 없는 오류가 발생했습니다.`);
    });

  pendingFontRequests.set(fontUrl, request);
  return request;
}

interface GenerateEmbedPreviewSvgParams {
  theme: EmbedPreviewTheme;
  size: EmbedPreviewSize;
  language: EmbedPreviewLanguage;
  overview: CharacterOverview;
}

export async function generateEmbedPreviewSvg({
  theme,
  size,
  language,
  overview,
}: GenerateEmbedPreviewSvgParams) {
  const preset = resolveEmbedSatoriPreset(size);
  const [notoSansKrFontData] = await Promise.all([
    loadFontData(NotoSansKrFontUrl, "Noto Sans KR"),
  ]);
  if (!cachedSatori) {
    const satoriModule = await import("satori");
    cachedSatori = satoriModule.default;
  }
  const satori = cachedSatori;

  try {
    const svg = await satori(
      <DashboardEmbeddingBannerSatori
        level={overview.level}
        exp={overview.exp}
        expToLevel={overview.expToLevel}
        gold={overview.gold}
        ap={overview.ap}
        floor={overview.floor}
        stats={overview.stats}
        equipment={overview.equipment}
        theme={theme}
        size={size}
        language={language}
      />,
      {
        width: preset.width,
        height: preset.height,
        fonts: [
          {
            name: "Noto Sans KR",
            data: notoSansKrFontData,
            weight: 400,
            style: "normal",
          },
        ],
      }
    );

    return svg;
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

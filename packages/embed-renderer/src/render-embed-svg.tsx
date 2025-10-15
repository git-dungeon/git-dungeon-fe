import {
  DashboardEmbeddingBannerSatori,
  resolveDashboardEmbeddingBannerLayout,
} from "./components/dashboard-embedding-banner-satori";
import { injectBonusAnimation } from "./lib/inject-bonus-animation";
import type {
  EmbedFontConfig,
  EmbedFontStyle,
  EmbedFontWeight,
  EmbedRenderParams,
} from "./types";

const DEFAULT_NODE_ENV =
  typeof process !== "undefined" && process?.env?.NODE_ENV
    ? process.env.NODE_ENV
    : "production";

declare global {
  // eslint-disable-next-line no-var
  var __EMBED_RENDERER_SATORI__: Promise<
    typeof import("satori").default
  > | null;
}

function ensureProcessEnv() {
  if (typeof globalThis.process === "undefined") {
    Object.defineProperty(globalThis, "process", {
      value: {
        env: {
          NODE_ENV: DEFAULT_NODE_ENV,
        },
      },
    });
    return;
  }

  if (!globalThis.process.env) {
    globalThis.process.env = { NODE_ENV: DEFAULT_NODE_ENV };
    return;
  }

  if (!globalThis.process.env.NODE_ENV) {
    globalThis.process.env.NODE_ENV = DEFAULT_NODE_ENV;
  }
}

async function loadSatoriInstance(): Promise<typeof import("satori").default> {
  if (!globalThis.__EMBED_RENDERER_SATORI__) {
    globalThis.__EMBED_RENDERER_SATORI__ = import("satori").then(
      (module) => module.default
    );
  }
  return globalThis.__EMBED_RENDERER_SATORI__;
}

export interface RenderEmbedSvgOptions extends EmbedRenderParams {
  fonts: EmbedFontConfig[];
  /**
   * Optional Satori instance to reuse in constrained environments.
   */
  satori?: typeof import("satori").default;
  /**
   * SVG 후처리 애니메이션을 활성화할지 여부.
   * 기본값은 true이며, 활성화 시 보너스 스탯 영역에 글로우/연기 이펙트를 주입한다.
   */
  enableAnimation?: boolean;
}

export async function renderEmbedSvg({
  theme,
  size,
  language,
  overview,
  fonts,
  satori,
  enableAnimation = true,
}: RenderEmbedSvgOptions) {
  ensureProcessEnv();

  const loadedSatori = satori ?? (await loadSatoriInstance());

  const layout = resolveDashboardEmbeddingBannerLayout({
    level: overview.level,
    exp: overview.exp,
    expToLevel: overview.expToLevel,
    gold: overview.gold,
    ap: overview.ap,
    floor: overview.floor,
    stats: overview.stats,
    equipment: overview.equipment,
    theme,
    size,
    language,
  });

  const svg = await loadedSatori(
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
      width: layout.preset.width,
      height: layout.height,
      fonts: fonts.map((font) => {
        const weight = (font.weight ?? 400) as EmbedFontWeight;
        const style: EmbedFontStyle = font.style ?? "normal";
        return {
          name: font.name,
          data: font.data,
          weight,
          style,
        };
      }),
    }
  );

  if (!enableAnimation) {
    return svg;
  }

  return injectBonusAnimation(svg);
}

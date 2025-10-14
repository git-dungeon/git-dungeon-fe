import { DashboardEmbeddingBannerSatori } from "./components/dashboard-embedding-banner-satori";
import {
  resolveEmbedSatoriPreset,
  resolveEmbedSatoriPalette,
} from "./lib/satori-presets";
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
  var __EMBED_RENDERER_SATORI__: Promise<typeof import("satori").default> | null;
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
}

export async function renderEmbedSvg({
  theme,
  size,
  language,
  overview,
  fonts,
  satori,
}: RenderEmbedSvgOptions) {
  ensureProcessEnv();

  const preset = resolveEmbedSatoriPreset(size);
  const loadedSatori = satori ?? (await loadSatoriInstance());

  const palette = resolveEmbedSatoriPalette(theme);

  return loadedSatori(
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
}

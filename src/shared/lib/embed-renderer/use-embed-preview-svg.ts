import { useEffect, useMemo, useState } from "react";
import type { CharacterOverview } from "@/features/character-summary/lib/build-character-overview";
import type {
  EmbedPreviewLanguage,
  EmbedPreviewSize,
  EmbedPreviewTheme,
} from "@/entities/embed/model/types";
import { generateEmbedPreviewSvg } from "@/shared/lib/embed-renderer/generate-embed-preview-svg";
import { useCatalog } from "@/entities/catalog/model/use-catalog";
import type { CatalogData } from "@/entities/catalog/model/types";
import {
  buildCatalogItemNameMap,
  resolveCatalogItemName,
} from "@/entities/catalog/lib/item-name";
import { resolveLocalItemSprite } from "@/entities/catalog/config/local-sprites";

interface UseEmbedPreviewSvgParams {
  theme: EmbedPreviewTheme;
  size: EmbedPreviewSize;
  language: EmbedPreviewLanguage;
  overview: CharacterOverview | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  maxAp?: number | null;
}

interface UseEmbedPreviewSvgResult {
  svgMarkup: string | null;
  svgDataUrl: string | null;
  renderError: string | null;
  isRendering: boolean;
}

export function useEmbedPreviewSvg({
  theme,
  size,
  language,
  overview,
  displayName,
  avatarUrl,
  maxAp,
}: UseEmbedPreviewSvgParams): UseEmbedPreviewSvgResult {
  const catalogQuery = useCatalog(language);
  const itemNameMap = useMemo(
    () => buildCatalogItemNameMap(catalogQuery.data),
    [catalogQuery.data]
  );
  const resolvedSpriteMap = useMemo(() => {
    return buildCatalogSpriteMap(catalogQuery.data);
  }, [catalogQuery.data]);
  const resolvedOverview = useMemo(() => {
    if (!overview) {
      return null;
    }

    return {
      ...overview,
      equipment: overview.equipment.map((item) => ({
        ...item,
        name: resolveCatalogItemName(itemNameMap, item.code, item.name),
        sprite: (() => {
          const resolvedSprite = resolveEmbedItemSprite(
            item,
            resolvedSpriteMap
          );
          return isValidSpriteUrl(resolvedSprite) ? resolvedSprite : null;
        })(),
      })),
    };
  }, [catalogQuery.data, itemNameMap, overview, resolvedSpriteMap]);
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);
  const [svgDataUrl, setSvgDataUrl] = useState<string | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    if (!resolvedOverview) {
      setSvgMarkup(null);
      setSvgDataUrl(null);
      setRenderError(null);
      setIsRendering(false);
      return;
    }

    let cancelled = false;
    setIsRendering(true);
    setSvgMarkup(null);
    setSvgDataUrl(null);
    setRenderError(null);

    generateEmbedPreviewSvg({
      theme,
      size,
      language,
      overview: resolvedOverview,
      displayName,
      avatarUrl,
      maxAp,
    })
      .then((svg) => {
        if (!cancelled) {
          setSvgMarkup(svg);
          setSvgDataUrl(
            `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
          );
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setRenderError(
            error instanceof Error
              ? error.message
              : "SVG 렌더링 중 알 수 없는 오류가 발생했습니다."
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsRendering(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [theme, size, language, resolvedOverview, displayName, avatarUrl, maxAp]);

  return {
    svgMarkup,
    svgDataUrl,
    renderError,
    isRendering,
  };
}

interface CatalogSpriteMap {
  spriteUrlMap: Record<string, string>;
  assetsBaseUrl: string | null;
  spriteIdByCode: Record<string, string>;
}

function buildCatalogSpriteMap(
  catalog: CatalogData | null | undefined
): CatalogSpriteMap {
  if (!catalog) {
    return { spriteUrlMap: {}, assetsBaseUrl: null, spriteIdByCode: {} };
  }
  return {
    spriteUrlMap: catalog.spriteMap ?? {},
    assetsBaseUrl: catalog.assetsBaseUrl ?? null,
    spriteIdByCode: Object.fromEntries(
      catalog.items
        .filter((item) => item.spriteId != null)
        .map((item) => [item.code, String(item.spriteId)])
    ),
  };
}

function resolveEmbedItemSprite(
  item: CharacterOverview["equipment"][number],
  catalog: CatalogSpriteMap
) {
  if (isValidSpriteUrl(item.sprite)) {
    return item.sprite;
  }

  const spriteKey = item.sprite ?? catalog.spriteIdByCode[item.code] ?? null;
  const resolvedFromCatalog = resolveCatalogSpriteUrl(spriteKey, catalog);
  if (isValidSpriteUrl(resolvedFromCatalog)) {
    return resolvedFromCatalog;
  }

  const localSprite = resolveLocalItemSprite(item.code, spriteKey);
  return isValidSpriteUrl(localSprite) ? localSprite : null;
}

function resolveCatalogSpriteUrl(
  spriteKey: string | null,
  catalog: CatalogSpriteMap
) {
  if (!spriteKey) {
    return null;
  }

  const mapped = catalog.spriteUrlMap[spriteKey];
  if (mapped) {
    return mapped;
  }

  if (!catalog.assetsBaseUrl) {
    return null;
  }

  const base = catalog.assetsBaseUrl.endsWith("/")
    ? catalog.assetsBaseUrl
    : `${catalog.assetsBaseUrl}/`;
  return `${base}${spriteKey}`;
}

function isValidSpriteUrl(sprite?: string | null): sprite is string {
  if (!sprite) {
    return false;
  }
  return (
    sprite.startsWith("data:") ||
    sprite.startsWith("http://") ||
    sprite.startsWith("https://") ||
    sprite.startsWith("/")
  );
}

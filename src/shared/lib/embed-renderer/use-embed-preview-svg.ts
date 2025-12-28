import { useEffect, useMemo, useState } from "react";
import type { CharacterOverview } from "@/features/character-summary/lib/build-character-overview";
import type {
  EmbedPreviewLanguage,
  EmbedPreviewSize,
  EmbedPreviewTheme,
} from "@/entities/embed/model/types";
import { generateEmbedPreviewSvg } from "@/shared/lib/embed-renderer/generate-embed-preview-svg";
import { useCatalog } from "@/entities/catalog/model/use-catalog";
import {
  buildCatalogItemNameMap,
  resolveCatalogItemName,
} from "@/entities/catalog/lib/item-name";

interface UseEmbedPreviewSvgParams {
  theme: EmbedPreviewTheme;
  size: EmbedPreviewSize;
  language: EmbedPreviewLanguage;
  overview: CharacterOverview | null;
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
}: UseEmbedPreviewSvgParams): UseEmbedPreviewSvgResult {
  const catalogQuery = useCatalog(language);
  const itemNameMap = useMemo(
    () => buildCatalogItemNameMap(catalogQuery.data),
    [catalogQuery.data]
  );
  const resolvedOverview = useMemo(() => {
    if (!overview) {
      return null;
    }
    if (!catalogQuery.data) {
      return overview;
    }

    return {
      ...overview,
      equipment: overview.equipment.map((item) => ({
        ...item,
        name: resolveCatalogItemName(itemNameMap, item.code, item.name),
      })),
    };
  }, [catalogQuery.data, itemNameMap, overview]);
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
  }, [theme, size, language, resolvedOverview]);

  return {
    svgMarkup,
    svgDataUrl,
    renderError,
    isRendering,
  };
}

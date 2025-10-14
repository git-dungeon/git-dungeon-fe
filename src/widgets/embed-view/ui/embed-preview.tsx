import { useEffect, useState } from "react";
import type { CharacterOverview } from "@/features/character-summary/lib/build-character-overview";
import { formatDateTime } from "@/shared/lib/datetime/formatters";
import type {
  EmbedPreviewLanguage,
  EmbedPreviewSize,
  EmbedPreviewTheme,
} from "@/entities/embed/model/types";
import { getEmbedPreviewContainerClass } from "@/widgets/embed-view/ui/embed-container";
import { generateEmbedPreviewSvg } from "@/widgets/embed-view/lib/generate-embed-preview-svg";
import { EmbedPreviewSkeleton } from "@/widgets/embed-view/ui/embed-preview-skeleton";
import { EmbedErrorCard } from "@/widgets/embed-view/ui/embed-error-card";

interface EmbedPreviewProps {
  userId: string;
  theme: EmbedPreviewTheme;
  size: EmbedPreviewSize;
  language: EmbedPreviewLanguage;
  generatedAt: string;
  overview: CharacterOverview;
}

export function EmbedPreview({
  userId,
  theme,
  size,
  language,
  generatedAt,
  overview,
}: EmbedPreviewProps) {
  const generatedAtLabel = formatDateTime(new Date(generatedAt));
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setSvgMarkup(null);
    setRenderError(null);

    async function renderSvg() {
      try {
        const svg = await generateEmbedPreviewSvg({
          theme,
          size,
          language,
          overview,
        });

        if (!cancelled) {
          setSvgMarkup(svg);
        }
      } catch (error) {
        if (!cancelled) {
          setRenderError(
            error instanceof Error
              ? error.message
              : "SVG 렌더링 중 알 수 없는 오류가 발생했습니다."
          );
        }
      }
    }

    void renderSvg();

    return () => {
      cancelled = true;
    };
  }, [theme, size, language, overview]);

  if (renderError) {
    return (
      <div className="flex w-full justify-center">
        <EmbedErrorCard
          title="SVG 렌더링에 실패했습니다"
          message={renderError}
          size={size}
          language={language}
        />
      </div>
    );
  }

  if (!svgMarkup) {
    return <EmbedPreviewSkeleton size={size} language={language} />;
  }

  return (
    <div className="flex w-full justify-center">
      <section
        className={getEmbedPreviewContainerClass(size)}
        data-embed-theme={theme}
        data-embed-size={size}
        data-embed-language={language}
      >
        <div className="border-border bg-background overflow-hidden rounded-2xl border">
          <div
            aria-label="임베드 SVG 프리뷰"
            dangerouslySetInnerHTML={{ __html: svgMarkup }}
          />
        </div>
        <div className="text-muted-foreground flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
          <span>생성 시각: {generatedAtLabel}</span>
          <span>
            userId: <code className="font-mono text-xs">{userId}</code>
          </span>
        </div>
      </section>
    </div>
  );
}

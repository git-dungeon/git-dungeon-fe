import type { CharacterOverview } from "@/features/character-summary/lib/build-character-overview";
import { formatDateTime } from "@/shared/lib/datetime/formatters";
import { cn } from "@/shared/lib/utils";
import type {
  EmbedPreviewLanguage,
  EmbedPreviewSize,
  EmbedPreviewTheme,
} from "@/entities/embed/model/types";
import {
  getEmbedPreviewAspectClass,
  getEmbedPreviewContainerClass,
} from "@/widgets/embed-view/ui/embed-container";
import { useEmbedPreviewSvg } from "@/shared/lib/embed-renderer/use-embed-preview-svg";
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
  const { svgDataUrl, renderError } = useEmbedPreviewSvg({
    theme,
    size,
    language,
    overview,
  });

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

  if (!svgDataUrl) {
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
        <figure
          className={cn(
            "border-border bg-background overflow-hidden rounded-2xl border",
            getEmbedPreviewAspectClass(size)
          )}
        >
          <img
            src={svgDataUrl}
            alt="임베드 SVG 프리뷰"
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </figure>
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

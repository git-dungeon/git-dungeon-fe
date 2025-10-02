import { DashboardEmbeddingBanner } from "@/widgets/dashboard-embedding/ui/dashboard-embedding-banner";
import type { CharacterOverview } from "@/features/character-summary/lib/build-character-overview";
import { formatDateTime } from "@/shared/lib/datetime/formatters";
import type {
  EmbedPreviewLanguage,
  EmbedPreviewSize,
} from "@/entities/embed/model/types";
import { getEmbedPreviewContainerClass } from "@/widgets/embed-view/ui/embed-container";

interface EmbedPreviewProps {
  userId: string;
  theme: string;
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
  const bannerLayoutMode = size === "compact" ? "responsive" : "desktop";

  return (
    <div className="flex w-full justify-center">
      <section
        className={getEmbedPreviewContainerClass(size)}
        data-embed-theme={theme}
        data-embed-size={size}
        data-embed-language={language}
      >
        <DashboardEmbeddingBanner
          level={overview.level}
          exp={overview.exp}
          expToLevel={overview.expToLevel}
          gold={overview.gold}
          ap={overview.ap}
          floor={overview.floor}
          stats={overview.stats}
          equipment={overview.equipment}
          layoutClassName="w-full"
          layoutMode={bannerLayoutMode}
        />
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

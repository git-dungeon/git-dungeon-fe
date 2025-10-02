import { DashboardEmbeddingBanner } from "@/widgets/dashboard-embedding/ui/dashboard-embedding-banner";
import type { CharacterOverview } from "@/features/character-summary/lib/build-character-overview";
import { formatDateTime } from "@/shared/lib/datetime/formatters";

interface EmbedPreviewProps {
  userId: string;
  theme: string;
  generatedAt: string;
  overview: CharacterOverview;
}

export function EmbedPreview({
  userId,
  theme,
  generatedAt,
  overview,
}: EmbedPreviewProps) {
  const generatedAtLabel = formatDateTime(new Date(generatedAt));

  return (
    <div className="flex flex-col items-center">
      <DashboardEmbeddingBanner
        level={overview.level}
        exp={overview.exp}
        expToLevel={overview.expToLevel}
        gold={overview.gold}
        ap={overview.ap}
        floor={overview.floor}
        stats={overview.stats}
        equipment={overview.equipment}
        layoutClassName="max-w-3xl"
      />
      <dl className="text-muted-foreground mt-4 space-y-1 text-center text-xs">
        <div>
          <dt className="font-medium">userId</dt>
          <dd>{userId}</dd>
        </div>
        <div>
          <dt className="font-medium">theme</dt>
          <dd>{theme}</dd>
        </div>
        <div>
          <dt className="font-medium">generatedAt</dt>
          <dd>{generatedAtLabel}</dd>
        </div>
      </dl>
    </div>
  );
}

import { DashboardEmbeddingBanner } from "@/widgets/dashboard-embedding/ui/dashboard-embedding-banner";
import {
  embedFallbackEquipment,
  embedFallbackStats,
} from "@/widgets/embed-view/lib/fallback-embed-data";

interface EmbedPreviewProps {
  userId: string;
}

export function EmbedPreview({ userId }: EmbedPreviewProps) {
  return (
    <div className="flex flex-col items-center">
      <DashboardEmbeddingBanner
        level={27}
        exp={1840}
        expToLevel={2500}
        gold={7260}
        ap={4}
        floor={{ current: 27, best: 32, progress: 0.58 }}
        stats={embedFallbackStats}
        equipment={embedFallbackEquipment}
        layoutClassName="max-w-3xl"
      />
      <p className="text-muted-foreground mt-3 text-xs">userId: {userId}</p>
    </div>
  );
}

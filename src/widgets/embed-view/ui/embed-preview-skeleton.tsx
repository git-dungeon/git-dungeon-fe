import type {
  EmbedPreviewLanguage,
  EmbedPreviewSize,
} from "@/entities/embed/model/types";
import { getEmbedPreviewContainerClass } from "@/widgets/embed-view/ui/embed-container";

interface EmbedPreviewSkeletonProps {
  size?: EmbedPreviewSize;
  language?: EmbedPreviewLanguage;
}

export function EmbedPreviewSkeleton({
  size = "wide",
  language = "ko",
}: EmbedPreviewSkeletonProps) {
  return (
    <div className="flex w-full justify-center">
      <section
        className={getEmbedPreviewContainerClass(size)}
        aria-label="임베드 프리뷰 로딩 중"
        data-embed-size={size}
        data-embed-language={language}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`summary-${index}`}
                className="bg-muted/20 h-24 animate-pulse rounded-xl"
              />
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div className="bg-muted/20 h-56 animate-pulse rounded-2xl" />
            <div className="bg-muted/20 h-56 animate-pulse rounded-2xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`meta-${index}`}
              className="bg-muted/20 h-12 animate-pulse rounded-lg"
            />
          ))}
        </div>
      </section>
    </div>
  );
}

import type {
  EmbedPreviewLanguage,
  EmbedPreviewSize,
} from "@/entities/embed/model/types";
import { getEmbedPreviewContainerClass } from "@/widgets/embed-view/ui/embed-container";
import { Button } from "@/shared/ui/button";

interface EmbedErrorCardProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  size?: EmbedPreviewSize;
  language?: EmbedPreviewLanguage;
}

export function EmbedErrorCard({
  title = "잘못된 요청입니다",
  message,
  onRetry,
  size = "wide",
  language = "ko",
}: EmbedErrorCardProps) {
  return (
    <div className="flex w-full justify-center">
      <section
        className={getEmbedPreviewContainerClass(size)}
        data-embed-size={size}
        data-embed-language={language}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-foreground text-xl font-semibold">{title}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {message}
          </p>
        </div>
        {onRetry ? (
          <Button size="sm" onClick={onRetry}>
            다시 시도
          </Button>
        ) : null}
      </section>
    </div>
  );
}

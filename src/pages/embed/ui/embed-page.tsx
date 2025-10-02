import { useEffect } from "react";

import { EmbedErrorCard } from "@/widgets/embed-view/ui/embed-error-card";
import { EmbedPreview } from "@/widgets/embed-view/ui/embed-preview";
import { useEmbedPreview } from "@/entities/embed/model/use-embed-preview";
import { EmbedPreviewSkeleton } from "@/widgets/embed-view/ui/embed-preview-skeleton";
import { cn } from "@/shared/lib/utils";
import type { EmbedSearchParams } from "@/pages/embed/model/embed-search-params";

interface EmbedPageProps {
  search: EmbedSearchParams;
}

export function EmbedPage({ search }: EmbedPageProps) {
  useEffect(() => {
    document.title = "Git Dungeon Embed";

    const robotsMeta = document.querySelector<HTMLMetaElement>(
      'meta[name="robots"]'
    );

    if (robotsMeta) {
      robotsMeta.content = "noindex, nofollow";
      return;
    }

    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
  }, []);

  const hasUserId = search.userId !== null;
  const userId = search.userId ?? "";
  const themeClass = search.theme === "dark" ? "dark" : undefined;
  const {
    data: previewData,
    isPending,
    isError,
    refetch,
  } = useEmbedPreview(
    {
      userId,
      theme: search.theme,
      size: search.size,
      language: search.language,
    },
    {
      enabled: hasUserId,
    }
  );

  if (!hasUserId) {
    return (
      <div
        className={cn(
          "text-foreground flex w-full justify-center bg-transparent px-4 py-6",
          themeClass
        )}
        data-embed-theme={search.theme}
        data-embed-size={search.size}
        data-embed-language={search.language}
      >
        <EmbedErrorCard
          message={search.error ?? "userId 쿼리 파라미터를 전달해주세요."}
          size={search.size}
          language={search.language}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "text-foreground flex w-full justify-center bg-transparent px-4 py-6",
        themeClass
      )}
      data-embed-theme={search.theme}
      data-embed-size={search.size}
      data-embed-language={search.language}
    >
      {isPending ? (
        <EmbedPreviewSkeleton size={search.size} language={search.language} />
      ) : isError || !previewData ? (
        <EmbedErrorCard
          title="임베드 데이터를 가져오지 못했습니다"
          message="잠시 후 다시 시도하거나 관리자에게 문의해주세요."
          onRetry={() => void refetch()}
          size={search.size}
          language={search.language}
        />
      ) : (
        <EmbedPreview
          userId={previewData.userId}
          theme={previewData.theme}
          size={previewData.size}
          language={previewData.language}
          generatedAt={previewData.generatedAt}
          overview={previewData.overview}
        />
      )}
    </div>
  );
}

import { useEffect } from "react";
import type { EmbedSearchParams } from "@/pages/embed/model/embed-search-params";
import { EmbedErrorCard } from "@/widgets/embed-view/ui/embed-error-card";
import { EmbedPreview } from "@/widgets/embed-view/ui/embed-preview";

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

  if (search.userId === null) {
    return (
      <div
        className="flex w-full justify-center bg-transparent px-4 py-6"
        data-embed-theme={search.theme}
      >
        <EmbedErrorCard
          message={search.error ?? "userId 쿼리 파라미터를 전달해주세요."}
        />
      </div>
    );
  }

  const userId = search.userId;

  return (
    <div
      className="flex w-full justify-center bg-transparent px-4 py-6"
      data-embed-theme={search.theme}
    >
      <EmbedPreview userId={userId} />
    </div>
  );
}

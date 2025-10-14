import { useMemo, useState } from "react";
import type { EmbeddingSize } from "@/entities/settings/model/types";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button, buttonVariants } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { formatDateTime } from "@/shared/lib/datetime/formatters";
import { useCharacterOverview } from "@/features/character-summary/model/use-character-overview";
import { useEmbedPreviewSvg } from "@/shared/lib/embed-renderer/use-embed-preview-svg";
import { useSettingsPreferences } from "@/features/settings/model/use-settings-preferences";
import { resolveThemePreference } from "@/shared/lib/preferences/preferences";
import type {
  EmbedPreviewLanguage,
  EmbedPreviewSize,
  EmbedPreviewTheme,
} from "@/entities/embed/model/types";
import { EmbedPreviewSkeleton } from "@/widgets/embed-view/ui/embed-preview-skeleton";
import { EmbedErrorCard } from "@/widgets/embed-view/ui/embed-error-card";
import {
  getEmbedPreviewAspectClass,
  getEmbedPreviewContainerClass,
} from "@/widgets/embed-view/ui/embed-container";
import { EMBEDDING_ENDPOINTS, resolveApiUrl } from "@/shared/config/env";

const EMBEDDING_SIZE_OPTIONS: Array<{
  value: EmbeddingSize;
  label: string;
  hint: string;
}> = [
  { value: "compact", label: "Compact", hint: "블로그 사이드바" },
  { value: "square", label: "Square", hint: "README 카드" },
  { value: "wide", label: "Wide", hint: "대시보드 배너" },
];

export function SettingsEmbeddingPreviewCard() {
  const [size, setSize] = useState<EmbeddingSize>("compact");
  const overview = useCharacterOverview();
  const { theme: themePreference, language: languagePreference } =
    useSettingsPreferences();

  const embedTheme = resolveThemePreference(
    themePreference
  ) as EmbedPreviewTheme;
  const embedLanguage = languagePreference as EmbedPreviewLanguage;
  const embedSize = size as EmbedPreviewSize;

  const character = overview.data;
  const {
    svgDataUrl,
    renderError: embedRenderError,
    isRendering,
  } = useEmbedPreviewSvg({
    theme: embedTheme,
    size: embedSize,
    language: embedLanguage,
    overview: character,
  });

  const isFetchingOverview = overview.isLoading || overview.isFetching;
  const isBusy = isFetchingOverview || isRendering || !character;
  const userId = overview.dashboard.data?.state.userId ?? "me";

  const generatedAtLabel = useMemo(() => {
    return formatDateTime(new Date());
  }, []);

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>캐릭터 대시보드</CardTitle>
          <CardDescription>
            대시보드와 인벤토리 데이터를 조합한 임베딩 미리보기입니다.
          </CardDescription>
        </div>
        <CardAction className="flex items-center gap-2">
          {EMBEDDING_SIZE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(
                buttonVariants({
                  variant: option.value === size ? "default" : "outline",
                  size: "sm",
                }),
                "flex flex-col gap-0 text-xs"
              )}
              onClick={() => setSize(option.value)}
              disabled={isBusy}
            >
              <span>{option.label}</span>
              <span className="text-muted-foreground text-[10px]">
                {option.hint}
              </span>
            </button>
          ))}
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-6">
        {overview.isError
          ? renderOverviewError(overview.refetch)
          : embedRenderError
            ? renderEmbedError(embedRenderError, embedSize, embedLanguage)
            : !svgDataUrl
              ? renderSkeleton(embedSize, embedLanguage)
              : renderPreviewContent({
                  svgDataUrl,
                  size: embedSize,
                  theme: embedTheme,
                  language: embedLanguage,
                  generatedAtLabel,
                  userId,
                })}
      </CardContent>
    </Card>
  );
}

function renderOverviewError(onRetry: () => Promise<void>) {
  return (
    <div className="bg-destructive/5 text-destructive border-destructive/20 flex flex-col items-start gap-3 rounded-lg border p-6">
      <div>
        <p className="font-semibold">미리보기를 불러오지 못했습니다.</p>
        <p className="text-destructive/80 text-sm">
          네트워크 상태를 확인한 뒤 다시 시도하세요.
        </p>
      </div>
      <Button variant="destructive" size="sm" onClick={() => void onRetry()}>
        다시 시도
      </Button>
    </div>
  );
}

function renderEmbedError(
  message: string,
  size: EmbedPreviewSize,
  language: EmbedPreviewLanguage
) {
  return (
    <div className="flex w-full justify-center">
      <EmbedErrorCard
        title="SVG 렌더링에 실패했습니다"
        message={message}
        size={size}
        language={language}
      />
    </div>
  );
}

function renderSkeleton(
  size: EmbedPreviewSize,
  language: EmbedPreviewLanguage
) {
  return <EmbedPreviewSkeleton size={size} language={language} />;
}

interface RenderPreviewContentParams {
  svgDataUrl: string;
  size: EmbedPreviewSize;
  theme: EmbedPreviewTheme;
  language: EmbedPreviewLanguage;
  generatedAtLabel: string;
  userId: string;
}

function renderPreviewContent({
  svgDataUrl,
  size,
  theme,
  language,
  generatedAtLabel,
  userId,
}: RenderPreviewContentParams) {
  const containerClassName = getEmbedPreviewContainerClass(size);
  const aspectClassName = getEmbedPreviewAspectClass(size);
  const exampleUrl = resolveApiUrl(
    `${EMBEDDING_ENDPOINTS.preview}?userId=${encodeURIComponent(
      userId
    )}&size=${size}&theme=${theme}&language=${language}`
  );

  return (
    <div className="space-y-4">
      <section
        className={containerClassName}
        data-embed-theme={theme}
        data-embed-size={size}
        data-embed-language={language}
      >
        <figure
          className={cn("bg-background overflow-hidden", aspectClassName)}
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
          <span className="truncate">
            URL 예시: <code className="font-mono text-xs">{exampleUrl}</code>
          </span>
        </div>
      </section>
    </div>
  );
}

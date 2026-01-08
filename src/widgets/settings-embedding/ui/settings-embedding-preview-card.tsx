import { useMemo, useState } from "react";
import type { TFunction } from "i18next";
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
import { useTranslation } from "react-i18next";
import { PixelPanel } from "@/shared/ui/pixel-panel";
import { PixelButton } from "@/shared/ui/pixel-button";

const EMBEDDING_SIZE_OPTIONS: Array<{
  value: EmbedPreviewSize;
  labelKey: string;
  hintKey: string;
}> = [
  {
    value: "compact",
    labelKey: "settings.embedding.size.compact.label",
    hintKey: "settings.embedding.size.compact.hint",
  },
  {
    value: "square",
    labelKey: "settings.embedding.size.square.label",
    hintKey: "settings.embedding.size.square.hint",
  },
  {
    value: "wide",
    labelKey: "settings.embedding.size.wide.label",
    hintKey: "settings.embedding.size.wide.hint",
  },
];

export function SettingsEmbeddingPreviewCard() {
  const { t } = useTranslation();
  const [size, setSize] = useState<EmbedPreviewSize>("compact");
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
  const userId = overview.dashboard.data?.userId ?? "me";

  const generatedAtLabel = useMemo(() => {
    return formatDateTime(new Date());
  }, []);

  const headerRight = (
    <div className="flex items-center gap-2">
      {EMBEDDING_SIZE_OPTIONS.map((option) => (
        <PixelButton
          key={option.value}
          type="button"
          className={cn(
            "flex flex-col gap-0 text-xs",
            option.value === size && "pixel-button--active"
          )}
          pixelSize="compact"
          onClick={() => setSize(option.value)}
          disabled={isBusy}
        >
          <span>{t(option.labelKey)}</span>
          <span className="text-[10px] opacity-80">{t(option.hintKey)}</span>
        </PixelButton>
      ))}
    </div>
  );

  return (
    <PixelPanel
      title={t("settings.embedding.title")}
      headerRight={headerRight}
      className="p-4"
      contentClassName="space-y-6"
    >
      <p className="pixel-text-muted pixel-text-sm">
        {t("settings.embedding.description")}
      </p>
      {overview.isError
        ? renderOverviewError(t, overview.refetch)
        : embedRenderError
          ? renderEmbedError(t, embedRenderError, embedSize, embedLanguage)
          : !svgDataUrl
            ? renderSkeleton(embedSize, embedLanguage)
            : renderPreviewContent({
                t,
                svgDataUrl,
                size: embedSize,
                theme: embedTheme,
                language: embedLanguage,
                generatedAtLabel,
                userId,
              })}
    </PixelPanel>
  );
}

function renderOverviewError(t: TFunction, onRetry: () => Promise<void>) {
  return (
    <div className="bg-destructive/5 border-destructive/20 flex flex-col items-start gap-3 rounded-lg border p-6">
      <div>
        <p className="pixel-text-danger font-semibold">
          {t("settings.embedding.error.title")}
        </p>
        <p className="pixel-text-danger pixel-text-sm opacity-80">
          {t("settings.embedding.error.description")}
        </p>
      </div>
      <PixelButton
        tone="danger"
        pixelSize="compact"
        onClick={() => void onRetry()}
      >
        {t("settings.embedding.error.retry")}
      </PixelButton>
    </div>
  );
}

function renderEmbedError(
  t: TFunction,
  message: string,
  size: EmbedPreviewSize,
  language: EmbedPreviewLanguage
) {
  return (
    <div className="flex w-full justify-center">
      <EmbedErrorCard
        title={t("settings.embedding.renderError.title")}
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
  t: TFunction;
  svgDataUrl: string;
  size: EmbedPreviewSize;
  theme: EmbedPreviewTheme;
  language: EmbedPreviewLanguage;
  generatedAtLabel: string;
  userId: string;
}

function renderPreviewContent({
  t,
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
            alt={t("settings.embedding.previewAlt")}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </figure>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="pixel-text-muted pixel-text-xs">
            {t("settings.embedding.generatedAt", { time: generatedAtLabel })}
          </span>
          <span className="pixel-text-muted pixel-text-xs truncate">
            {t("settings.embedding.urlExample")}{" "}
            <code className="pixel-text-base pixel-text-xs font-mono">
              {exampleUrl}
            </code>
          </span>
        </div>
      </section>
    </div>
  );
}

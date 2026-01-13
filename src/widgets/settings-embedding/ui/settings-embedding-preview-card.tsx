import { useEffect, useMemo, useRef, useState } from "react";
import type { TFunction } from "i18next";
import { cn } from "@/shared/lib/utils";
import { formatDateTime } from "@/shared/lib/datetime/formatters";
import { useCharacterOverview } from "@/features/character-summary/model/use-character-overview";
import { useEmbedPreviewSvg } from "@/shared/lib/embed-renderer/use-embed-preview-svg";
import { useSettingsPreferences } from "@/features/settings/model/use-settings-preferences";
import { resolveThemePreference } from "@/shared/lib/preferences/preferences";
import { useProfile } from "@/entities/profile/model/use-profile";
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
import {
  EMBEDDING_ENDPOINTS,
  resolveApiUrl,
  resolveWebUrl,
} from "@/shared/config/env";
import { useTranslation } from "react-i18next";
import { PixelPanel } from "@/shared/ui/pixel-panel";
import { PixelButton } from "@/shared/ui/pixel-button";
import { toast } from "sonner";

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
    value: "wide",
    labelKey: "settings.embedding.size.wide.label",
    hintKey: "settings.embedding.size.wide.hint",
  },
];

export function SettingsEmbeddingPreviewCard() {
  const { t } = useTranslation();
  const [size, setSize] = useState<EmbedPreviewSize>("compact");
  const [isCopied, setIsCopied] = useState(false);
  const copyTimeoutRef = useRef<number | null>(null);
  const overview = useCharacterOverview();
  const profileQuery = useProfile();
  const { theme: themePreference, language: languagePreference } =
    useSettingsPreferences();

  const embedTheme = resolveThemePreference(
    themePreference
  ) as EmbedPreviewTheme;
  const embedLanguage = languagePreference as EmbedPreviewLanguage;
  const embedSize = size as EmbedPreviewSize;

  const character = overview.data;
  const profile = profileQuery.data?.profile;
  const displayName = profile?.displayName ?? profile?.username ?? undefined;
  const avatarUrl = profile?.avatarUrl ?? undefined;
  const webLinkUrl = resolveWebUrl("/");
  const userId = overview.dashboard.data?.userId ?? "me";
  const exampleUrl = useMemo(() => {
    return resolveApiUrl(
      `${EMBEDDING_ENDPOINTS.previewSvg}?userId=${encodeURIComponent(
        userId
      )}&size=${embedSize}&theme=${embedTheme}&language=${embedLanguage}`
    );
  }, [embedLanguage, embedSize, embedTheme, userId]);
  const exampleSnippet = useMemo(() => {
    const imgTag = `<img src="${exampleUrl}"/>`;
    return `<a href="${webLinkUrl}">\n  ${imgTag}\n</a>`;
  }, [exampleUrl, webLinkUrl]);
  const {
    svgDataUrl,
    renderError: embedRenderError,
    isRendering,
  } = useEmbedPreviewSvg({
    theme: embedTheme,
    size: embedSize,
    language: embedLanguage,
    overview: character,
    displayName,
    avatarUrl,
  });

  const isFetchingOverview = overview.isLoading || overview.isFetching;
  const isFetchingProfile = profileQuery.isLoading || profileQuery.isFetching;
  const isBusy =
    isFetchingOverview || isFetchingProfile || isRendering || !character;
  const hasOverviewError = overview.isError;
  const hasProfileError = profileQuery.isError;

  const generatedAtLabel = useMemo(() => {
    return formatDateTime(new Date());
  }, []);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current);
        copyTimeoutRef.current = null;
      }
    };
  }, []);

  const handleRetry = async () => {
    await Promise.allSettled([overview.refetch(), profileQuery.refetch()]);
  };

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
      {hasOverviewError
        ? renderOverviewError(t, handleRetry)
        : hasProfileError
          ? renderProfileError(t, handleRetry)
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
                  exampleSnippet,
                  isCopied,
                  onCopy: async () => {
                    try {
                      await navigator.clipboard.writeText(exampleSnippet);
                      setIsCopied(true);
                      toast.success(t("settings.embedding.copySuccess"));
                      if (copyTimeoutRef.current !== null) {
                        window.clearTimeout(copyTimeoutRef.current);
                      }
                      copyTimeoutRef.current = window.setTimeout(() => {
                        setIsCopied(false);
                        copyTimeoutRef.current = null;
                      }, 1500);
                    } catch (error) {
                      toast.error(t("settings.embedding.copyError"));
                      if (import.meta.env?.DEV) {
                        console.error("[embed-preview] copy failed", error);
                      }
                    }
                  },
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

function renderProfileError(t: TFunction, onRetry: () => Promise<void>) {
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
  exampleSnippet: string;
  isCopied: boolean;
  onCopy: () => void;
}

function renderPreviewContent({
  t,
  svgDataUrl,
  size,
  theme,
  language,
  generatedAtLabel,
  exampleSnippet,
  isCopied,
  onCopy,
}: RenderPreviewContentParams) {
  const containerClassName = cn(
    getEmbedPreviewContainerClass(size),
    size === "compact" && "mx-auto"
  );
  const aspectClassName = getEmbedPreviewAspectClass(size);

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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="pixel-text-muted pixel-text-xs">
            {t("settings.embedding.generatedAt", { time: generatedAtLabel })}
          </span>
          <div className="flex flex-col gap-2 sm:max-w-[70%]">
            <span className="pixel-text-muted pixel-text-xs">
              {t("settings.embedding.snippetExample")}
            </span>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <pre className="pixel-text-xs bg-muted/40 rounded border px-3 py-2 font-mono text-[10px] break-all whitespace-pre-wrap">
                {exampleSnippet}
              </pre>
              <PixelButton
                type="button"
                pixelSize="compact"
                onClick={onCopy}
                className="shrink-0"
              >
                {isCopied
                  ? t("settings.embedding.copied")
                  : t("settings.embedding.copy")}
              </PixelButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

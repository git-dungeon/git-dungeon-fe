import { Loader2, LogOut, RefreshCw } from "lucide-react";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { useProfile } from "@/entities/profile/model/use-profile";
import { SettingsProfileCard } from "@/widgets/settings-profile/ui/settings-profile-card";
import { SettingsPreferencesCard } from "@/widgets/settings-preferences/ui/settings-preferences-card";
import { SettingsEmbeddingPreviewCard } from "@/widgets/settings-embedding/ui/settings-embedding-preview-card";
import { useLogout } from "@/features/auth/logout/model/use-logout";
import { PixelPanel } from "@/shared/ui/pixel-panel";
import { PixelSkeleton } from "@/shared/ui/pixel-skeleton";
import { PixelButton } from "@/shared/ui/pixel-button";

export function SettingsPage() {
  const { t } = useTranslation();
  const profileQuery = useProfile();
  const logoutMutation = useLogout();

  const handleLogout = () => logoutMutation.mutateAsync();
  const handleRetry = () => profileQuery.refetch();

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1
            className="font-pixel-title pixel-page-title"
            data-text={t("settings.title")}
          >
            {t("settings.title")}
          </h1>
        </div>
        <PixelButton
          type="button"
          className="gap-2"
          onClick={() => void handleLogout()}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <LogOut className="size-4" aria-hidden />
          )}
          {t("settings.logout")}
        </PixelButton>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {renderProfileSection(t, profileQuery, handleRetry)}
        <SettingsPreferencesCard />
      </div>

      <SettingsEmbeddingPreviewCard />
    </section>
  );
}

function renderProfileSection(
  t: (key: string) => string,
  query: ReturnType<typeof useProfile>,
  onRetry: () => Promise<unknown>
): JSX.Element {
  if (query.isLoading) {
    return (
      <PixelPanel
        title={t("settings.profile.title")}
        className="p-4"
        contentClassName="space-y-6"
      >
        <PixelSkeleton titleWidth="w-36" lineWidths={["w-56", "w-40"]} />
        <PixelSkeleton titleWidth="w-28" lineWidths={["w-40", "w-32"]} />
      </PixelPanel>
    );
  }

  if (query.isError || !query.data) {
    return (
      <PixelPanel
        title={t("settings.profile.title")}
        className="p-4"
        contentClassName="space-y-4"
      >
        <p className="pixel-text-danger text-sm">
          {t("settings.profile.loadError")}
        </p>
        <PixelButton
          type="button"
          className="gap-2 text-white"
          tone="danger"
          pixelSize="compact"
          onClick={() => void onRetry()}
        >
          <RefreshCw className="size-4" aria-hidden />
          {t("settings.profile.retry")}
        </PixelButton>
      </PixelPanel>
    );
  }

  return (
    <SettingsProfileCard
      profile={query.data.profile}
      connections={query.data.connections}
    />
  );
}

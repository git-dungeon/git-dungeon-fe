import { RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useProfile } from "@/entities/profile/model/use-profile";
import { PixelButton } from "@/shared/ui/pixel-button";
import { PixelPanel } from "@/shared/ui/pixel-panel";
import { PixelSkeleton } from "@/shared/ui/pixel-skeleton";
import { SettingsProfileCard } from "@/widgets/settings-profile/ui/settings-profile-card";

export function SettingsProfileSection() {
  const { t } = useTranslation();
  const profileQuery = useProfile();

  if (profileQuery.isLoading) {
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

  if (profileQuery.isError || !profileQuery.data) {
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
          onClick={() => void profileQuery.refetch()}
        >
          <RefreshCw className="size-4" aria-hidden />
          {t("settings.profile.retry")}
        </PixelButton>
      </PixelPanel>
    );
  }

  return (
    <SettingsProfileCard
      profile={profileQuery.data.profile}
      connections={profileQuery.data.connections}
    />
  );
}

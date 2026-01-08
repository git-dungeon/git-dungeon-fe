import { Loader2, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SettingsProfileSection } from "@/widgets/settings-profile/ui/settings-profile-section";
import { SettingsPreferencesCard } from "@/widgets/settings-preferences/ui/settings-preferences-card";
import { SettingsEmbeddingPreviewCard } from "@/widgets/settings-embedding/ui/settings-embedding-preview-card";
import { useLogout } from "@/features/auth/logout/model/use-logout";
import { PixelButton } from "@/shared/ui/pixel-button";

export function SettingsPage() {
  const { t } = useTranslation();
  const logoutMutation = useLogout();

  const handleLogout = () => logoutMutation.mutateAsync();

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-pixel-title pixel-page-title">
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
        <SettingsProfileSection />
        <SettingsPreferencesCard />
      </div>

      <SettingsEmbeddingPreviewCard />
    </section>
  );
}

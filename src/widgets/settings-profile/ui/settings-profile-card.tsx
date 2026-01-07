import type {
  ProfileConnections,
  Profile,
} from "@/entities/profile/model/types";
import { PixelPanel } from "@/shared/ui/pixel-panel";
import { ProfileIdentity } from "@/features/settings/ui/profile-identity";
import { GithubConnection } from "@/features/settings/ui/github-connection";
import { ProfileFieldList } from "@/features/settings/ui/profile-field-list";
import {
  formatDateTime,
  formatRelativeTime,
} from "@/shared/lib/datetime/formatters";
import { useTranslation } from "react-i18next";

interface SettingsProfileCardProps {
  profile: Profile;
  connections: ProfileConnections;
}

export function SettingsProfileCard({
  profile,
  connections,
}: SettingsProfileCardProps) {
  const { t } = useTranslation();
  const joinedAtValue = formatDateWithFallback(t, profile.joinedAt);

  return (
    <PixelPanel
      title={t("settings.profile.title")}
      className="p-4"
      contentClassName="space-y-6"
    >
      <p className="pixel-text-muted pixel-text-sm">
        {t("settings.profile.description")}
      </p>
      <ProfileIdentity profile={profile} />
      <ProfileFieldList
        fields={[
          {
            id: "email",
            label: t("settings.profile.fields.email"),
            value: profile.email ?? "-",
          },
          {
            id: "user-id",
            label: t("settings.profile.fields.userId"),
            value: profile.userId,
          },
          {
            id: "joined-at",
            label: t("settings.profile.fields.joinedAt"),
            value: joinedAtValue.value,
            hint: joinedAtValue.hint,
            title: joinedAtValue.title,
          },
        ]}
      />
      <div className="border-t border-white/10 pt-4">
        <GithubConnection connections={connections} />
      </div>
    </PixelPanel>
  );
}

function formatDateWithFallback(
  t: (key: string) => string,
  value?: string | null
) {
  if (!value) {
    return { value: t("settings.profile.fields.missing") } as const;
  }

  const formatted = formatDateTime(value);
  return {
    value: formatted,
    hint: formatRelativeTime(value),
    title: formatted,
  } as const;
}

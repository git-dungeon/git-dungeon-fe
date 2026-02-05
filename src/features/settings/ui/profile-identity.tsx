import type { Profile } from "@/entities/profile/model/types";
import { PixelAvatar } from "@/shared/ui/pixel-avatar";
import { useTranslation } from "react-i18next";

interface ProfileIdentityProps {
  profile: Profile;
}

export function ProfileIdentity({ profile }: ProfileIdentityProps) {
  const { t } = useTranslation();
  const initials = resolveInitials(profile);

  return (
    <div className="flex items-center gap-4">
      <PixelAvatar
        src={profile.avatarUrl}
        alt={t("settings.profile.avatarAlt")}
        fallback={<span className="text-base font-semibold">{initials}</span>}
        className="size-16 p-0"
        imageClassName="h-full w-full object-cover"
      />
      <div className="space-y-1">
        <p className="pixel-text-base text-lg font-semibold">
          {profile.displayName ?? profile.username}
        </p>
        <p className="pixel-text-muted pixel-text-sm">@{profile.username}</p>
        {profile.email ? (
          <p className="pixel-text-muted pixel-text-xs">{profile.email}</p>
        ) : null}
      </div>
    </div>
  );
}

function resolveInitials(profile: Profile): string {
  const label = profile.displayName ?? profile.username ?? "?";
  return label
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

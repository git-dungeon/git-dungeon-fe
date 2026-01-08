import type { Profile } from "@/entities/profile/model/types";
import { useTranslation } from "react-i18next";

interface ProfileIdentityProps {
  profile: Profile;
}

export function ProfileIdentity({ profile }: ProfileIdentityProps) {
  const { t } = useTranslation();
  const initials = resolveInitials(profile);

  return (
    <div className="flex items-center gap-4">
      <Avatar
        media={profile.avatarUrl}
        fallback={initials}
        alt={t("settings.profile.avatarAlt")}
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

function Avatar({
  media,
  fallback,
  alt,
}: {
  media?: string;
  fallback: string;
  alt: string;
}) {
  return (
    <div className="bg-muted pixel-text-base flex size-16 items-center justify-center overflow-hidden rounded-full border">
      {media ? (
        <img
          src={media}
          alt={alt}
          className="size-full object-cover"
          loading="lazy"
        />
      ) : (
        <span className="text-base font-semibold">{fallback}</span>
      )}
    </div>
  );
}

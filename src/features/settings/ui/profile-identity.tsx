import type { SettingsProfile } from "@/entities/settings/model/types";

interface ProfileIdentityProps {
  profile: SettingsProfile;
}

export function ProfileIdentity({ profile }: ProfileIdentityProps) {
  const initials = resolveInitials(profile);

  return (
    <div className="flex items-center gap-4">
      <Avatar media={profile.avatarUrl} fallback={initials} />
      <div className="space-y-1">
        <p className="text-foreground text-lg font-semibold">
          {profile.displayName ?? profile.username}
        </p>
        <p className="text-muted-foreground text-sm">@{profile.username}</p>
      </div>
    </div>
  );
}

function resolveInitials(profile: SettingsProfile): string {
  const label = profile.displayName ?? profile.username ?? "?";
  return label
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Avatar({ media, fallback }: { media?: string; fallback: string }) {
  return (
    <div className="bg-muted text-muted-foreground flex size-16 items-center justify-center overflow-hidden rounded-full border">
      {media ? (
        <img
          src={media}
          alt="사용자 아바타"
          className="size-full object-cover"
          loading="lazy"
        />
      ) : (
        <span className="text-base font-semibold">{fallback}</span>
      )}
    </div>
  );
}

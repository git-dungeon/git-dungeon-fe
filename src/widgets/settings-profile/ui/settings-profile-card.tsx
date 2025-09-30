import { ExternalLink } from "lucide-react";
import type {
  SettingsConnections,
  SettingsProfile,
} from "@/entities/settings/model/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

interface SettingsProfileCardProps {
  profile: SettingsProfile;
  connections: SettingsConnections;
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

export function SettingsProfileCard({
  profile,
  connections,
}: SettingsProfileCardProps) {
  const initials = resolveInitials(profile);
  const github = connections.github;

  return (
    <Card>
      <CardHeader>
        <CardTitle>계정 정보</CardTitle>
        <CardDescription>계정 세부 정보를 표시합니다.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          {renderAvatar(profile.avatarUrl, initials)}
          <div className="space-y-1">
            <p className="text-foreground text-lg font-semibold">
              {profile.displayName ?? profile.username}
            </p>
            <p className="text-muted-foreground text-sm">@{profile.username}</p>
          </div>
        </div>

        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          {renderProfileField("이메일", profile.email ?? "-")}
          {renderProfileField("사용자 ID", profile.userId)}
        </dl>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 border-t pt-6">
        <div className="flex w-full items-center justify-between gap-4">
          <div>
            <p className="text-foreground text-sm font-semibold">GitHub 연동</p>
          </div>
          <Badge
            variant={github?.connected ? "secondary" : "outline"}
            className={cn(
              "text-xs",
              github?.connected
                ? "bg-emerald-500/10 text-emerald-600"
                : undefined
            )}
          >
            {github?.connected ? "연결됨" : "미연결"}
          </Badge>
        </div>
        {github?.profileUrl ? (
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <a href={github.profileUrl} target="_blank" rel="noreferrer">
              GitHub 프로필 열기
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            연동 정보가 없습니다
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function renderProfileField(label: string, value: string) {
  return (
    <div key={label} className="space-y-1">
      <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {label}
      </dt>
      <dd className="text-foreground text-sm font-semibold">{value}</dd>
    </div>
  );
}

function renderAvatar(media: string | undefined, fallback: string) {
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

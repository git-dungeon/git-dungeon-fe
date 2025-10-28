import type {
  ProfileConnections,
  Profile,
} from "@/entities/profile/model/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { ProfileIdentity } from "@/features/settings/ui/profile-identity";
import { GithubConnection } from "@/features/settings/ui/github-connection";
import { ProfileFieldList } from "@/features/settings/ui/profile-field-list";
import {
  formatDateTime,
  formatRelativeTime,
} from "@/shared/lib/datetime/formatters";

interface SettingsProfileCardProps {
  profile: Profile;
  connections: ProfileConnections;
}

export function SettingsProfileCard({
  profile,
  connections,
}: SettingsProfileCardProps) {
  const joinedAtValue = formatDateWithFallback(profile.joinedAt);

  return (
    <Card>
      <CardHeader>
        <CardTitle>계정 정보</CardTitle>
        <CardDescription>계정 세부 정보를 표시합니다.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ProfileIdentity profile={profile} />
        <ProfileFieldList
          fields={[
            { id: "email", label: "이메일", value: profile.email ?? "-" },
            { id: "user-id", label: "사용자 ID", value: profile.userId },
            {
              id: "joined-at",
              label: "가입일",
              value: joinedAtValue.value,
              hint: joinedAtValue.hint,
              title: joinedAtValue.title,
            },
          ]}
        />
      </CardContent>
      <CardFooter className="border-t pt-6">
        <GithubConnection connections={connections} />
      </CardFooter>
    </Card>
  );
}

function formatDateWithFallback(value?: string | null) {
  if (!value) {
    return { value: "미기록" } as const;
  }

  const formatted = formatDateTime(value);
  return {
    value: formatted,
    hint: formatRelativeTime(value),
    title: formatted,
  } as const;
}

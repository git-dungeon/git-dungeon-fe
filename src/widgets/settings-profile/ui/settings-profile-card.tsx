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
import { ProfileIdentity } from "@/features/settings/ui/profile-identity";
import { GithubConnection } from "@/features/settings/ui/github-connection";
import { ProfileFieldList } from "@/features/settings/ui/profile-field-list";

interface SettingsProfileCardProps {
  profile: SettingsProfile;
  connections: SettingsConnections;
}

export function SettingsProfileCard({
  profile,
  connections,
}: SettingsProfileCardProps) {
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
            { label: "이메일", value: profile.email ?? "-" },
            { label: "사용자 ID", value: profile.userId },
          ]}
        />
      </CardContent>
      <CardFooter className="border-t pt-6">
        <GithubConnection connections={connections} />
      </CardFooter>
    </Card>
  );
}

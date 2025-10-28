import { Loader2, LogOut, RefreshCw } from "lucide-react";
import type { JSX } from "react";
import { useProfile } from "@/entities/profile/model/use-profile";
import { SettingsProfileCard } from "@/widgets/settings-profile/ui/settings-profile-card";
import { SettingsPreferencesCard } from "@/widgets/settings-preferences/ui/settings-preferences-card";
import { SettingsEmbeddingPreviewCard } from "@/widgets/settings-embedding/ui/settings-embedding-preview-card";
import { useLogout } from "@/features/auth/logout/model/use-logout";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

export function SettingsPage() {
  const profileQuery = useProfile();
  const logoutMutation = useLogout();

  const handleLogout = () => logoutMutation.mutateAsync();
  const handleRetry = () => profileQuery.refetch();

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-foreground text-2xl font-semibold">설정</h1>
          <p className="text-muted-foreground text-sm">
            계정 정보와 로컬 환경설정을 관리하고 임베딩 미리보기를 확인하세요.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => void handleLogout()}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <LogOut className="size-4" aria-hidden />
          )}
          로그아웃
        </Button>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {renderProfileSection(profileQuery, handleRetry)}
        <SettingsPreferencesCard />
      </div>

      <SettingsEmbeddingPreviewCard />
    </section>
  );
}

function renderProfileSection(
  query: ReturnType<typeof useProfile>,
  onRetry: () => Promise<unknown>
): JSX.Element {
  if (query.isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle className="bg-muted h-5 w-36 rounded" />
          <CardDescription className="bg-muted/80 h-4 w-64 rounded" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-muted size-16 rounded-full" />
            <div className="space-y-2">
              <div className="bg-muted h-4 w-32 rounded" />
              <div className="bg-muted/80 h-3 w-24 rounded" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-muted/70 h-12 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (query.isError || !query.data) {
    return (
      <Card className="bg-destructive/5 text-destructive border-destructive/20">
        <CardHeader>
          <CardTitle>계정 정보</CardTitle>
          <CardDescription>
            설정 정보를 불러오지 못했습니다. 다시 시도해 주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="gap-2 text-white"
            onClick={() => void onRetry()}
          >
            <RefreshCw className="size-4" aria-hidden />
            다시 시도
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <SettingsProfileCard
      profile={query.data.profile}
      connections={query.data.connections}
    />
  );
}

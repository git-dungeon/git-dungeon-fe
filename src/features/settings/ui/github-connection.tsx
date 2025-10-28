import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";
import {
  formatDateTime,
  formatRelativeTime,
} from "@/shared/lib/datetime/formatters";
import type { ProfileConnections } from "@/entities/profile/model/types";

interface GithubConnectionProps {
  connections: ProfileConnections;
}

export function GithubConnection({ connections }: GithubConnectionProps) {
  const github = connections.github;
  const isConnected = github?.connected ?? false;

  const lastSyncLabel = resolveLastSyncLabel(github);

  return (
    <div className="flex w-full flex-col items-start gap-3">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-foreground text-sm font-semibold">GitHub 연동</p>
          <p
            className="text-muted-foreground text-xs"
            title={lastSyncLabel?.title}
          >
            {lastSyncLabel?.text ??
              (isConnected
                ? "최근 동기화 정보를 불러올 수 없습니다."
                : "계정을 연동하면 커밋 통계가 표시됩니다.")}
          </p>
        </div>
        <Badge
          variant={isConnected ? "secondary" : "outline"}
          className={cn(
            "text-xs",
            isConnected ? "bg-emerald-500/10 text-emerald-600" : undefined
          )}
        >
          {isConnected ? "연결됨" : "미연결"}
        </Badge>
      </div>
    </div>
  );
}

function resolveLastSyncLabel(
  github?: ProfileConnections["github"]
): { text: string; title?: string } | null {
  if (!github?.connected) {
    return null;
  }

  if (!github.lastSyncAt) {
    return { text: "마지막 동기화 정보 없음" };
  }

  const relative = formatRelativeTime(github.lastSyncAt);
  const absolute = formatDateTime(github.lastSyncAt);
  return {
    text: `마지막 동기화 ${relative}`,
    title: absolute,
  };
}

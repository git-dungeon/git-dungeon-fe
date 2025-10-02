import { ExternalLink } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import type { SettingsConnections } from "@/entities/settings/model/types";

interface GithubConnectionProps {
  connections: SettingsConnections;
}

export function GithubConnection({ connections }: GithubConnectionProps) {
  const github = connections.github;

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex w-full items-center justify-between gap-4">
        <div>
          <p className="text-foreground text-sm font-semibold">GitHub 연동</p>
        </div>
        <Badge
          variant={github?.connected ? "secondary" : "outline"}
          className={cn(
            "text-xs",
            github?.connected ? "bg-emerald-500/10 text-emerald-600" : undefined
          )}
        >
          {github?.connected ? "연결됨" : "미연결"}
        </Badge>
      </div>
      {github?.profileUrl ? (
        <Button variant="outline" size="sm" className="gap-2" asChild>
          <a href={github.profileUrl} target="_blank" rel="noopener noreferrer">
            GitHub 프로필 열기
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          연동 정보가 없습니다
        </Button>
      )}
    </div>
  );
}

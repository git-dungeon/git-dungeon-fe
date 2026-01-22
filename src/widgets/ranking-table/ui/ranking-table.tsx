import { PixelButton } from "@/shared/ui/pixel-button";
import {
  PixelEmptyState,
  PixelErrorState,
  PixelSkeletonState,
} from "@/shared/ui/pixel-state";
import { PixelPanel } from "@/shared/ui/pixel-panel";
import { useRankingList } from "@/widgets/ranking-table/model/use-ranking-list";
import type { RankingEntry } from "@/entities/ranking/model/types";

interface RankingTableProps {
  limit?: number;
}

export function RankingTable({ limit = 10 }: RankingTableProps) {
  const {
    rankings,
    status,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useRankingList({ limit });

  if (status === "pending") {
    return <PixelSkeletonState count={2} />;
  }

  if (status === "error") {
    const message = error instanceof Error ? error.message : undefined;

    return (
      <PixelErrorState
        message="랭킹 정보를 불러오지 못했습니다."
        actions={<PixelButton onClick={() => refetch()}>다시 시도</PixelButton>}
      >
        {message ? <p className="pixel-text-muted text-xs">{message}</p> : null}
      </PixelErrorState>
    );
  }

  if (rankings.length === 0) {
    return <PixelEmptyState message="표시할 랭킹이 없습니다." />;
  }

  const isRefreshing = isFetching || isFetchingNextPage;

  return (
    <PixelPanel className="p-4" contentClassName="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] table-fixed text-left text-sm">
          <thead>
            <tr className="text-muted-foreground border-b border-white/10 text-xs tracking-wider uppercase">
              <th className="w-20 pr-2 pb-3">Rank</th>
              <th className="pb-3">Player</th>
              <th className="w-24 pr-2 pb-3 text-right">Level</th>
              <th className="w-32 pb-3 text-right">Highest Floor</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((entry) => (
              <RankingRow key={entry.rank} entry={entry} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-3">
        {isFetchingNextPage ? (
          <span className="pixel-text-muted text-sm">불러오는 중...</span>
        ) : hasNextPage ? (
          <PixelButton onClick={() => fetchNextPage()} disabled={isRefreshing}>
            더 보기
          </PixelButton>
        ) : (
          <span className="pixel-text-muted text-sm">모두 불러왔습니다.</span>
        )}
      </div>
    </PixelPanel>
  );
}

function RankingRow({ entry }: { entry: RankingEntry }) {
  const displayName = entry.displayName?.trim() ? entry.displayName : "-";
  const avatarUrl = entry.avatarUrl?.trim() ? entry.avatarUrl : null;

  return (
    <tr className="border-b border-white/10 last:border-0">
      <td className="text-foreground py-3 pr-2 font-semibold">{entry.rank}</td>
      <td className="py-3">
        <div className="flex items-center gap-3">
          <div className="pixel-avatar h-10 w-10 p-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <span className="text-muted-foreground text-xs">-</span>
            )}
          </div>
          <span className="text-foreground min-w-0 truncate font-medium">
            {displayName}
          </span>
        </div>
      </td>
      <td className="text-foreground py-3 pr-2 text-right">{entry.level}</td>
      <td className="text-foreground py-3 text-right">{entry.maxFloor}</td>
    </tr>
  );
}

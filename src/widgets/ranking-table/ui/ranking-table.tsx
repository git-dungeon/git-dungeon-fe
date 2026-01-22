import { PixelButton } from "@/shared/ui/pixel-button";
import {
  PixelEmptyState,
  PixelErrorState,
  PixelSkeletonState,
} from "@/shared/ui/pixel-state";
import { PixelPanel } from "@/shared/ui/pixel-panel";
import { useRankingList } from "@/widgets/ranking-table/model/use-ranking-list";
import type { RankingEntry } from "@/entities/ranking/model/types";
import { useTranslation } from "react-i18next";

interface RankingTableProps {
  limit?: number;
}

const PANEL_MIN_HEIGHT_CLASS = "min-h-screen";

export function RankingTable({ limit = 10 }: RankingTableProps) {
  const { t } = useTranslation();
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
    return <PixelSkeletonState className={PANEL_MIN_HEIGHT_CLASS} count={2} />;
  }

  if (status === "error") {
    const message = error instanceof Error ? error.message : undefined;

    return (
      <PixelErrorState
        className={PANEL_MIN_HEIGHT_CLASS}
        message={t("ranking.state.error")}
        actions={
          <PixelButton onClick={() => refetch()}>
            {t("ranking.state.retry")}
          </PixelButton>
        }
      >
        {message ? <p className="pixel-text-muted text-xs">{message}</p> : null}
      </PixelErrorState>
    );
  }

  if (rankings.length === 0) {
    return (
      <PixelEmptyState
        className={PANEL_MIN_HEIGHT_CLASS}
        message={t("ranking.state.empty")}
      />
    );
  }

  const isRefreshing = isFetching || isFetchingNextPage;

  return (
    <PixelPanel
      className={`p-4 ${PANEL_MIN_HEIGHT_CLASS}`}
      contentClassName="flex min-h-full flex-col gap-4"
    >
      <div className="flex-1 overflow-x-auto">
        <table className="w-full min-w-[520px] table-fixed text-left text-sm">
          <thead>
            <tr className="text-muted-foreground border-b border-white/10 text-xs tracking-wider uppercase">
              <th className="w-20 pr-2 pb-3">{t("ranking.table.rank")}</th>
              <th className="pb-3">{t("ranking.table.player")}</th>
              <th className="w-24 pr-2 pb-3 text-right">
                {t("ranking.table.level")}
              </th>
              <th className="w-32 pb-3 text-right">
                {t("ranking.table.highestFloor")}
              </th>
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
          <span className="pixel-text-muted text-sm">
            {t("ranking.state.loadingMore")}
          </span>
        ) : hasNextPage ? (
          <PixelButton onClick={() => fetchNextPage()} disabled={isRefreshing}>
            {t("ranking.state.loadMore")}
          </PixelButton>
        ) : (
          <span className="pixel-text-muted text-sm">
            {t("ranking.state.allLoaded")}
          </span>
        )}
      </div>
    </PixelPanel>
  );
}

function RankingRow({ entry }: { entry: RankingEntry }) {
  const { t } = useTranslation();
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
                alt={t("ranking.avatarAlt")}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <span className="text-muted-foreground text-xs">—</span>
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

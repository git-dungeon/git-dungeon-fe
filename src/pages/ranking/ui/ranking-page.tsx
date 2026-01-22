import { useTranslation } from "react-i18next";
import { RankingTable } from "@/widgets/ranking-table/ui/ranking-table";
import { useRankingList } from "@/features/ranking-list/model/use-ranking-list";

export function RankingPage() {
  const { t } = useTranslation();
  const rankingList = useRankingList();

  return (
    <section className="space-y-6">
      <header>
        <h1
          className="font-pixel-title pixel-page-title"
          data-text={t("ranking.title")}
        >
          {t("ranking.title")}
        </h1>
      </header>
      <RankingTable {...rankingList} />
    </section>
  );
}

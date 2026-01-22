import { useTranslation } from "react-i18next";
import { RankingTable } from "@/widgets/ranking-table/ui/ranking-table";

export function RankingPage() {
  const { t } = useTranslation();

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
      <RankingTable />
    </section>
  );
}

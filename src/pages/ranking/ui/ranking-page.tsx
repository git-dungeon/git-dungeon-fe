import { RankingTable } from "@/widgets/ranking-table/ui/ranking-table";

export function RankingPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-pixel-title pixel-page-title" data-text="RANKING">
          RANKING
        </h1>
      </header>
      <RankingTable />
    </section>
  );
}

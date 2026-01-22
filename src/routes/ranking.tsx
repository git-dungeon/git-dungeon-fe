import { createFileRoute } from "@tanstack/react-router";
import { RankingPage } from "@/pages/ranking/ui/ranking-page";

export const Route = createFileRoute("/ranking")({
  component: RankingRoute,
});

function RankingRoute() {
  return <RankingPage />;
}

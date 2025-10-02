import { createFileRoute } from "@tanstack/react-router";
import { EmbedPage } from "@/pages/embed/ui/embed-page";
import { parseEmbedSearch } from "@/pages/embed/model/embed-search-params";

export const Route = createFileRoute("/embed")({
  validateSearch: parseEmbedSearch,
  component: EmbedRoute,
});

function EmbedRoute() {
  const search = Route.useSearch();

  return <EmbedPage search={search} />;
}

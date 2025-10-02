import { createFileRoute } from "@tanstack/react-router";
import { EmbedPage } from "@/pages/embed/ui/embed-page";

export const Route = createFileRoute("/embed")({
  component: EmbedRoute,
});

function EmbedRoute() {
  const search = Route.useSearch();

  return <EmbedPage search={search} />;
}

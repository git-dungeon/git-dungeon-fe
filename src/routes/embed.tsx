import { createFileRoute } from "@tanstack/react-router";
import { EmbedShell } from "@/pages/embed/ui/embed-shell";

export const Route = createFileRoute("/embed")({
  component: EmbedRoute,
});

function EmbedRoute() {
  return <EmbedShell />;
}

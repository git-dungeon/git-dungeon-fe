import { createFileRoute } from "@tanstack/react-router";
import { LogsPage } from "@/pages/dungeon-log/ui/logs-page";

export const Route = createFileRoute("/logs")({
  beforeLoad: ({ context, location }) => context.auth.authorize({ location }),
  loader: ({ context }) => context.auth.ensureSession(),
  component: LogsRoute,
});

function LogsRoute() {
  return <LogsPage />;
}

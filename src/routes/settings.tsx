import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/pages/settings/ui/settings-page";

export const Route = createFileRoute("/settings")({
  beforeLoad: ({ context, location }) => context.auth.authorize({ location }),
  loader: ({ context }) => context.auth.ensureSession(),
  component: SettingsRoute,
});

function SettingsRoute() {
  return <SettingsPage />;
}

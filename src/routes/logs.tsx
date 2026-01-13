import { createFileRoute } from "@tanstack/react-router";
import { LogsPage } from "@/pages/dungeon-log/ui/logs-page";
import { ensureOnboardingComplete } from "@/shared/lib/navigation/ensure-onboarding-complete";

export const Route = createFileRoute("/logs")({
  beforeLoad: async ({ context, location }) => {
    await context.auth.authorize({ location });
    await ensureOnboardingComplete(context.queryClient);
  },
  loader: ({ context }) => context.auth.ensureSession(),
  component: LogsRoute,
});

function LogsRoute() {
  return <LogsPage />;
}

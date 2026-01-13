import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/pages/settings/ui/settings-page";
import { ensureOnboardingComplete } from "@/shared/lib/navigation/ensure-onboarding-complete";

export const Route = createFileRoute("/settings")({
  beforeLoad: async ({ context, location }) => {
    await context.auth.authorize({ location });
    await ensureOnboardingComplete(context.queryClient);
  },
  loader: ({ context }) => context.auth.ensureSession(),
  component: SettingsRoute,
});

function SettingsRoute() {
  return <SettingsPage />;
}

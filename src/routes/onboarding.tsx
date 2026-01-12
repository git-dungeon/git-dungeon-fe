import { createFileRoute } from "@tanstack/react-router";
import { OnboardingPage } from "@/pages/onboarding/ui/onboarding-page";
import { githubSyncStatusQueryOptions } from "@/entities/github/model/github-sync-status-query";
import { ensureQueryDataSafe } from "@/shared/lib/query/ensure-query-data-safe";

export const Route = createFileRoute("/onboarding")({
  beforeLoad: ({ context, location }) => context.auth.authorize({ location }),
  loader: async ({ context }) => {
    await ensureQueryDataSafe(
      context.queryClient,
      githubSyncStatusQueryOptions
    );
  },
  component: OnboardingRoute,
});

function OnboardingRoute() {
  return <OnboardingPage />;
}

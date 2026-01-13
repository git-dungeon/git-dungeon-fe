import { createFileRoute, redirect } from "@tanstack/react-router";
import { OnboardingPage } from "@/pages/onboarding/ui/onboarding-page";
import {
  GITHUB_SYNC_STATUS_QUERY_KEY,
  githubSyncStatusQueryOptions,
} from "@/entities/github/model/github-sync-status-query";
import type { GithubSyncStatusData } from "@/entities/github/model/types";
import { ensureQueryDataSafe } from "@/shared/lib/query/ensure-query-data-safe";

export const Route = createFileRoute("/onboarding")({
  beforeLoad: ({ context, location }) => context.auth.authorize({ location }),
  loader: async ({ context }) => {
    await ensureQueryDataSafe(
      context.queryClient,
      githubSyncStatusQueryOptions
    );

    const status = context.queryClient.getQueryData<GithubSyncStatusData>(
      GITHUB_SYNC_STATUS_QUERY_KEY
    );

    if (status?.lastManualSyncAt) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: OnboardingRoute,
});

function OnboardingRoute() {
  return <OnboardingPage />;
}

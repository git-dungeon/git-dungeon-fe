import type { QueryClient } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import {
  GITHUB_SYNC_STATUS_QUERY_KEY,
  githubSyncStatusQueryOptions,
} from "@/entities/github/model/github-sync-status-query";
import type { GithubSyncStatusData } from "@/entities/github/model/types";
import { ensureQueryDataSafe } from "@/shared/lib/query/ensure-query-data-safe";

export async function ensureOnboardingComplete(
  queryClient: QueryClient
): Promise<void> {
  await ensureQueryDataSafe(queryClient, githubSyncStatusQueryOptions);

  const status = queryClient.getQueryData<GithubSyncStatusData>(
    GITHUB_SYNC_STATUS_QUERY_KEY
  );

  if (!status) {
    return;
  }

  if (!status.lastManualSyncAt) {
    throw redirect({ to: "/onboarding" });
  }
}

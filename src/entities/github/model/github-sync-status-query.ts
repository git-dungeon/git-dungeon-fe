import { queryOptions } from "@tanstack/react-query";
import { getGithubSyncStatus } from "@/entities/github/api/get-github-sync-status";

export const GITHUB_SYNC_STATUS_QUERY_KEY = [
  "github",
  "sync",
  "status",
] as const;

export const githubSyncStatusQueryOptions = queryOptions({
  queryKey: GITHUB_SYNC_STATUS_QUERY_KEY,
  queryFn: getGithubSyncStatus,
  staleTime: 1000 * 30,
  refetchOnWindowFocus: false,
});

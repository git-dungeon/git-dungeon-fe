import { useQuery } from "@tanstack/react-query";
import { githubSyncStatusQueryOptions } from "@/entities/github/model/github-sync-status-query";

export function useGithubSyncStatus() {
  return useQuery(githubSyncStatusQueryOptions);
}

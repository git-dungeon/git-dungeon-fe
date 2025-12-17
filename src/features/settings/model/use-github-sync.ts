import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postGithubSync } from "@/entities/github/api/post-github-sync";
import { PROFILE_QUERY_KEY } from "@/entities/profile/model/profile-query";
import { DASHBOARD_STATE_QUERY_KEY } from "@/entities/dashboard/model/dashboard-state-query";
import { GITHUB_SYNC_STATUS_QUERY_KEY } from "@/entities/github/model/github-sync-status-query";

export function useGithubSync() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postGithubSync,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: DASHBOARD_STATE_QUERY_KEY }),
      ]);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: GITHUB_SYNC_STATUS_QUERY_KEY,
      });
    },
  });
}

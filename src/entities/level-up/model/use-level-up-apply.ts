import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLevelUpSelect } from "@/entities/level-up/api/post-level-up-select";
import { LEVEL_UP_SELECTION_QUERY_KEY } from "@/entities/level-up/model/level-up-query";
import { DASHBOARD_STATE_QUERY_KEY } from "@/entities/dashboard/model/dashboard-state-query";

export function useLevelUpApply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postLevelUpSelect,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: LEVEL_UP_SELECTION_QUERY_KEY,
        }),
        queryClient.invalidateQueries({ queryKey: DASHBOARD_STATE_QUERY_KEY }),
      ]);
    },
  });
}

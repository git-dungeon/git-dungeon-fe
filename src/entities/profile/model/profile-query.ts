import { queryOptions } from "@tanstack/react-query";
import { getProfile } from "@/entities/profile/api/get-profile";

export const PROFILE_QUERY_KEY = ["profile", "overview"] as const;

export const profileQueryOptions = queryOptions({
  queryKey: PROFILE_QUERY_KEY,
  queryFn: getProfile,
  staleTime: 1000 * 60 * 2,
});

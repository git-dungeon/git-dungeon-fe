import { queryOptions } from "@tanstack/react-query";
import { getAuthSession } from "@/entities/auth/api/get-auth-session";
import { NetworkError } from "@/shared/api/http-client";

export const AUTH_SESSION_QUERY_KEY = ["auth", "session"] as const;

export const authSessionQueryOptions = queryOptions({
  queryKey: AUTH_SESSION_QUERY_KEY,
  queryFn: getAuthSession,
  staleTime: 1000 * 60 * 5,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  retry: (failureCount, error) => {
    if (error instanceof NetworkError) {
      return false;
    }
    return failureCount < 2;
  },
});

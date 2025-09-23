import { queryOptions } from "@tanstack/react-query";
import { getAuthSession } from "@/entities/auth/api/get-auth-session";

export const AUTH_SESSION_QUERY_KEY = ["auth", "session"] as const;

export const authSessionQueryOptions = queryOptions({
  queryKey: AUTH_SESSION_QUERY_KEY,
  queryFn: getAuthSession,
  staleTime: 1000 * 60 * 5,
});

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { authSessionQueryOptions } from "@/entities/auth/model/auth-session-query";
import type { AuthSession } from "@/entities/auth/model/types";

export function useAuthSession(): UseQueryResult<AuthSession | null> {
  return useQuery(authSessionQueryOptions);
}

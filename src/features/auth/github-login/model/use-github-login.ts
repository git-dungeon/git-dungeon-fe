import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { httpRequest } from "@/shared/api/http-client";
import {
  AUTH_ENDPOINTS,
  IS_MSW_ENABLED,
  resolveApiUrl,
} from "@/shared/config/env";
import { AUTH_SESSION_QUERY_KEY } from "@/entities/auth/model/auth-session-query";
import type { AuthSession } from "@/entities/auth/model/types";
import { writeAuthCookies } from "@/entities/auth/lib/auth-cookie";
import { authStore } from "@/entities/auth/model/access-token-store";

export interface UseGithubLoginOptions {
  redirectTo?: string;
}

export function useGithubLogin(options: UseGithubLoginOptions = {}) {
  const { redirectTo } = options;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useCallback(async () => {
    if (IS_MSW_ENABLED) {
      const response = await httpRequest<{
        session: AuthSession;
        accessToken: string;
      }>(AUTH_ENDPOINTS.startGithubOAuth, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ redirect: redirectTo }),
      });

      queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, response.session);
      writeAuthCookies(response.session);
      authStore.setAccessToken(response.accessToken);
      await navigate({ to: redirectTo ?? "/dashboard" });
      return;
    }

    const resolved = resolveApiUrl(AUTH_ENDPOINTS.startGithubOAuth);
    const targetUrl = resolved.startsWith("http")
      ? new URL(resolved)
      : new URL(resolved, window.location.origin);

    if (redirectTo) {
      targetUrl.searchParams.set("redirect", redirectTo);
    }

    window.location.href = targetUrl.toString();
  }, [navigate, queryClient, redirectTo]);
}

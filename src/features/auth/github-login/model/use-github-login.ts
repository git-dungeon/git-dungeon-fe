import { useCallback, useRef, useState } from "react";
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
import { sanitizeRedirectPath } from "@/shared/lib/navigation/sanitize-redirect-path";

export interface UseGithubLoginOptions {
  redirectTo?: string;
}

export function useGithubLogin(options: UseGithubLoginOptions = {}) {
  const { redirectTo } = options;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const processingRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const login = useCallback(async () => {
    if (processingRef.current) {
      return;
    }

    const safeRedirect = sanitizeRedirectPath(redirectTo, "/dashboard");

    processingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      if (IS_MSW_ENABLED) {
        const response = await httpRequest<{
          session: AuthSession;
          accessToken: string;
        }>(AUTH_ENDPOINTS.startGithubOAuth, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ redirect: safeRedirect }),
        });

        queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, response.session);
        writeAuthCookies(response.session);
        authStore.setAccessToken(response.accessToken);
        await navigate({ to: safeRedirect, replace: true });
        return;
      }

      const resolved = resolveApiUrl(AUTH_ENDPOINTS.startGithubOAuth);
      const targetUrl = resolved.startsWith("http")
        ? new URL(resolved)
        : new URL(resolved, window.location.origin);

      targetUrl.searchParams.set("redirect", safeRedirect);

      window.location.href = targetUrl.toString();
    } catch (rawError) {
      const fallbackError =
        rawError instanceof Error
          ? rawError
          : new Error("로그인 중 문제가 발생했습니다.");
      setError(fallbackError);
      throw fallbackError;
    } finally {
      processingRef.current = false;
      setIsLoading(false);
    }
  }, [navigate, queryClient, redirectTo]);

  return {
    login,
    isLoading,
    error,
  };
}

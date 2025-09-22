import { useCallback } from "react";
import { AUTH_ENDPOINTS, resolveApiUrl } from "@/shared/config/env";

export interface UseGithubLoginOptions {
  redirectTo?: string;
}

export function useGithubLogin(options: UseGithubLoginOptions = {}) {
  const { redirectTo } = options;

  return useCallback(() => {
    const resolved = resolveApiUrl(AUTH_ENDPOINTS.startGithubOAuth);
    const targetUrl = resolved.startsWith("http")
      ? new URL(resolved)
      : new URL(resolved, window.location.origin);

    if (redirectTo) {
      targetUrl.searchParams.set("redirect", redirectTo);
    }

    window.location.href = targetUrl.toString();
  }, [redirectTo]);
}

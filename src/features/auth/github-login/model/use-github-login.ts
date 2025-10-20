import { useCallback, useRef, useState } from "react";
import { AUTH_ENDPOINTS, resolveApiUrl } from "@/shared/config/env";
import { sanitizeRedirectPath } from "@/shared/lib/navigation/sanitize-redirect-path";

export interface UseGithubLoginOptions {
  redirectTo?: string;
}

const REDIRECT_BROWSER_REQUIRED_MESSAGE =
  "로그인을 진행하려면 브라우저 환경이 필요합니다.";
const REDIRECT_GENERIC_ERROR_MESSAGE =
  "로그인 중 문제가 발생했습니다. 잠시 후 다시 시도하세요.";

/**
 * @deprecated 팝업 기반 로그인 로직 제거에 따라 더 이상 사용되지 않습니다.
 *             추후 테스트 리팩터링 단계에서 정리될 예정입니다.
 */
export const GITHUB_POPUP_MESSAGE_CHANNEL = "git-dungeon:auth:github";

function buildGithubRedirectUrl(safeRedirect: string): string {
  const resolved = resolveApiUrl(AUTH_ENDPOINTS.startGithubOAuth);

  if (typeof window === "undefined" || !window.location?.origin) {
    return resolved;
  }

  const baseUrl = resolved.startsWith("http")
    ? new URL(resolved)
    : new URL(resolved, window.location.origin);

  baseUrl.searchParams.set("redirect", safeRedirect);
  return baseUrl.toString();
}

export function useGithubLogin(options: UseGithubLoginOptions = {}) {
  const { redirectTo } = options;
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
      if (typeof window === "undefined" || !window.location) {
        throw new Error(REDIRECT_BROWSER_REQUIRED_MESSAGE);
      }

      const targetUrl = buildGithubRedirectUrl(safeRedirect);
      window.location.assign(targetUrl);
    } catch (rawError) {
      const nextError =
        rawError instanceof Error
          ? rawError
          : new Error(REDIRECT_GENERIC_ERROR_MESSAGE);
      setError(nextError);
      processingRef.current = false;
      setIsLoading(false);
      throw nextError;
    }
  }, [redirectTo]);

  return {
    login,
    isLoading,
    error,
  };
}

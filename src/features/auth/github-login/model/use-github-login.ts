import { useCallback, useRef, useState } from "react";
import {
  AUTH_ENDPOINTS,
  IS_MSW_ENABLED,
  resolveApiUrl,
} from "@/shared/config/env";
import { sanitizeRedirectPath } from "@/shared/lib/navigation/sanitize-redirect-path";
import type { AuthSession } from "@/entities/auth/model/types";

export interface UseGithubLoginOptions {
  redirectTo?: string;
}

const REDIRECT_BROWSER_REQUIRED_MESSAGE =
  "로그인을 진행하려면 브라우저 환경이 필요합니다.";
const REDIRECT_GENERIC_ERROR_MESSAGE =
  "로그인 중 문제가 발생했습니다. 잠시 후 다시 시도하세요.";

function buildGithubRedirectUrl(safeRedirect: string): string {
  if (typeof window === "undefined" || !window.location?.origin) {
    return resolveApiUrl(AUTH_ENDPOINTS.startGithubOAuth);
  }

  if (IS_MSW_ENABLED) {
    const baseUrl = new URL(
      AUTH_ENDPOINTS.startGithubOAuth,
      window.location.origin
    );
    baseUrl.searchParams.set("redirect", safeRedirect);
    return baseUrl.toString();
  }

  const resolved = resolveApiUrl(AUTH_ENDPOINTS.startGithubOAuth);
  const baseUrl = resolved.startsWith("http")
    ? new URL(resolved)
    : new URL(resolved, window.location.origin);

  baseUrl.searchParams.set("redirect", safeRedirect);
  return baseUrl.toString();
}

declare global {
  interface Window {
    __mswAuth?: {
      login: (session?: Partial<AuthSession>) => Promise<void>;
      logout?: () => Promise<void>;
      status?: () => Promise<AuthSession | null>;
    };
  }
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

      if (IS_MSW_ENABLED && window.__mswAuth) {
        await window.__mswAuth.login();
        window.location.assign(safeRedirect);
        return;
      }

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
    } finally {
      // 네비게이션이 정상적으로 이루어지면 컴포넌트 언마운트 전까지는 잠시 로딩 상태가 유지될 수 있다.
      // 테스트 환경이나 네비게이션이 차단된 상황을 위해 상태를 원복한다.
      processingRef.current = false;
      setIsLoading(false);
    }
  }, [redirectTo]);

  return {
    login,
    isLoading,
    error,
  };
}

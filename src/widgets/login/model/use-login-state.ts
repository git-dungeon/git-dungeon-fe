import { useCallback, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useAuthSession } from "@/entities/auth/model/use-auth-session";

interface LoginSearch {
  redirect?: string;
  authError?: string;
}

interface UseLoginStateParams {
  authErrorCode?: string;
}

export type LoginStatusType = "info" | "error";

export interface LoginStatus {
  type: LoginStatusType;
  text: string;
}

const AUTH_ERROR_KEYS: Record<string, string> = {
  AUTH_PROVIDER_DENIED: "auth.login.errors.providerDenied",
  AUTH_REDIRECT_INVALID: "auth.login.errors.redirectInvalid",
  AUTH_SESSION_EXPIRED: "auth.login.errors.sessionExpired",
  AUTH_SESSION_INVALID: "auth.login.errors.sessionInvalid",
  AUTH_PROVIDER_ERROR: "auth.login.errors.providerError",
};

function resolveAuthErrorMessage(
  t: (key: string) => string,
  code?: string | null
): string | null {
  if (!code) {
    return null;
  }

  const normalized = code.toUpperCase();
  const key = AUTH_ERROR_KEYS[normalized] ?? "auth.login.errors.generic";
  return t(key);
}

function resolveLoginStatus(
  t: (key: string) => string,
  params: {
    isCheckingServer: boolean;
    isServerUnavailable: boolean;
    loginError: string | null;
    authErrorMessage: string | null;
  }
): LoginStatus | null {
  if (params.isCheckingServer) {
    return { text: t("auth.login.status.checking"), type: "info" };
  }
  if (params.isServerUnavailable) {
    return { text: t("auth.login.status.serverUnavailable"), type: "error" };
  }
  if (params.loginError) {
    return { text: params.loginError, type: "error" };
  }
  if (params.authErrorMessage) {
    return { text: params.authErrorMessage, type: "error" };
  }
  return null;
}

export function useLoginState({ authErrorCode }: UseLoginStateParams) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sessionQuery = useAuthSession();
  const [loginError, setLoginError] = useState<string | null>(null);

  const isPending = sessionQuery.isPending ?? false;
  const isFetching = sessionQuery.isFetching ?? false;
  const isRefetching = sessionQuery.isRefetching ?? false;
  const isCheckingServer = isPending || isFetching || isRefetching;
  const isServerUnavailable = Boolean(sessionQuery.isError);
  const authErrorMessage = resolveAuthErrorMessage(t, authErrorCode);

  const status = resolveLoginStatus(t, {
    isCheckingServer,
    isServerUnavailable,
    loginError,
    authErrorMessage,
  });

  const clearAuthError = useCallback(() => {
    const updateNavigate = navigate as unknown as (options: {
      search: (prev: LoginSearch) => LoginSearch;
      replace?: boolean;
    }) => void;

    updateNavigate({
      search: (prev) => ({
        ...prev,
        authError: undefined,
      }),
      replace: true,
    });
  }, [navigate]);

  const handleLoginStart = useCallback(() => {
    if (authErrorCode) {
      clearAuthError();
    }
    setLoginError(null);
  }, [authErrorCode, clearAuthError]);

  const handleLoginError = useCallback(
    (error: Error) => {
      const message = error?.message?.trim();
      setLoginError(message ? message : t("auth.login.errors.generic"));
    },
    [t]
  );

  return {
    status,
    isLoginDisabled: isCheckingServer || isServerUnavailable,
    onLoginStart: handleLoginStart,
    onLoginError: handleLoginError,
  };
}

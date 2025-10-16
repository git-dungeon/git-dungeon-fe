import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
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

const POPUP_FEATURES =
  "width=600,height=720,menubar=no,toolbar=no,location=no,status=no";
const POPUP_POLL_INTERVAL_MS = 400;
const POPUP_TIMEOUT_MS = 60_000;
const POPUP_MESSAGE_TYPE = "git-dungeon:auth:github";
const POPUP_BLOCKED_MESSAGE =
  "로그인 팝업이 차단되었습니다. 브라우저 설정을 확인하세요.";
const POPUP_CANCELLED_MESSAGE = "로그인을 취소했습니다.";
const POPUP_TIMEOUT_MESSAGE =
  "로그인 응답이 지연되어 취소되었습니다. 잠시 후 다시 시도하세요.";
const POPUP_GENERIC_ERROR_MESSAGE =
  "로그인 중 문제가 발생했습니다. 잠시 후 다시 시도하세요.";

interface GithubPopupSuccessPayload {
  redirect?: string | null;
  session?: AuthSession | null;
  accessToken?: string | null;
}

interface GithubPopupErrorPayload {
  message?: string;
  code?: string;
}

type GithubPopupMessage =
  | {
      type: typeof POPUP_MESSAGE_TYPE;
      status: "success";
      payload?: GithubPopupSuccessPayload;
    }
  | {
      type: typeof POPUP_MESSAGE_TYPE;
      status: "error" | "cancelled";
      payload?: GithubPopupErrorPayload;
    };

function getAllowedOrigins(): Set<string> {
  const origins = new Set<string>();

  if (typeof window !== "undefined" && window.location?.origin) {
    origins.add(window.location.origin);
  }

  try {
    const resolved = resolveApiUrl("/");
    if (resolved && resolved.startsWith("http")) {
      origins.add(new URL(resolved).origin);
    }
  } catch {
    // ignore resolution errors
  }

  return origins;
}

function buildPopupUrl(safeRedirect: string): string {
  const parent =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "http://localhost";

  if (IS_MSW_ENABLED) {
    const origin = parent;
    const popupUrl = new URL("/mock-auth/github-popup.html", origin);
    popupUrl.searchParams.set("redirect", safeRedirect);
    popupUrl.searchParams.set("parent", parent);
    return popupUrl.toString();
  }

  const resolved = resolveApiUrl(AUTH_ENDPOINTS.startGithubOAuth);
  const popupUrl = resolved.startsWith("http")
    ? new URL(resolved)
    : new URL(resolved, window.location.origin);

  popupUrl.searchParams.set("redirect", safeRedirect);
  popupUrl.searchParams.set("popup", "1");
  popupUrl.searchParams.set("parent", parent);
  return popupUrl.toString();
}

export function useGithubLogin(options: UseGithubLoginOptions = {}) {
  const { redirectTo } = options;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const processingRef = useRef(false);
  const popupRef = useRef<Window | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const safeRedirectRef = useRef("/dashboard");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
      popupRef.current = null;
      processingRef.current = false;
    };
  }, []);

  const login = useCallback(async () => {
    if (processingRef.current) {
      return;
    }

    const safeRedirect = sanitizeRedirectPath(redirectTo, "/dashboard");
    safeRedirectRef.current = safeRedirect;

    processingRef.current = true;
    setIsLoading(true);
    setError(null);

    const popupUrl = buildPopupUrl(safeRedirect);
    const popup = window.open(
      popupUrl,
      "git-dungeon-github-login",
      POPUP_FEATURES
    );

    if (!popup) {
      const blockedError = new Error(POPUP_BLOCKED_MESSAGE);
      processingRef.current = false;
      setIsLoading(false);
      setError(blockedError);
      throw blockedError;
    }

    popupRef.current = popup;
    popup.focus?.();

    return new Promise<void>((resolve, reject) => {
      const allowedOrigins = getAllowedOrigins();
      let closeWatcherId: number | null = null;
      let timeoutId: number | null = null;
      let hasCompleted = false;
      let hasMessageResolved = false;

      const cleanupResources = () => {
        if (closeWatcherId !== null) {
          window.clearInterval(closeWatcherId);
          closeWatcherId = null;
        }
        if (timeoutId !== null) {
          window.clearTimeout(timeoutId);
          timeoutId = null;
        }
        if (messageHandler) {
          window.removeEventListener("message", messageHandler);
          messageHandler = null;
        }
        if (popupRef.current && !popupRef.current.closed) {
          popupRef.current.close();
        }
        popupRef.current = null;
        cleanupRef.current = null;
      };

      cleanupRef.current = cleanupResources;

      const complete = (maybeError?: Error) => {
        if (hasCompleted) {
          return;
        }
        hasCompleted = true;
        cleanupResources();
        processingRef.current = false;
        setIsLoading(false);
        if (maybeError) {
          setError(maybeError);
          reject(maybeError);
        } else {
          setError(null);
          resolve();
        }
      };

      const resolveRedirect = (value: string | null | undefined) =>
        sanitizeRedirectPath(value ?? undefined, safeRedirectRef.current);

      let messageHandler: ((event: MessageEvent) => void) | null = null;

      const handleMessage = (event: MessageEvent) => {
        if (!popupRef.current || event.source !== popupRef.current) {
          return;
        }
        if (!allowedOrigins.has(event.origin)) {
          return;
        }

        const rawData = event.data;
        if (!rawData || typeof rawData !== "object") {
          return;
        }

        const data = rawData as GithubPopupMessage;
        if (data.type !== POPUP_MESSAGE_TYPE) {
          return;
        }

        if (data.status === "success") {
          if (hasMessageResolved) {
            return;
          }
          hasMessageResolved = true;
          cleanupResources();

          const payload = data.payload ?? {};
          const session = payload.session ?? null;
          const accessToken = payload.accessToken ?? null;
          if (session) {
            queryClient.setQueryData<AuthSession | null>(
              AUTH_SESSION_QUERY_KEY,
              session
            );
            writeAuthCookies(session);
          }
          if (typeof accessToken === "string" && accessToken.length > 0) {
            authStore.setAccessToken(accessToken);
          }

          queryClient
            .invalidateQueries({ queryKey: AUTH_SESSION_QUERY_KEY })
            .catch(() => {
              // swallow invalidate errors, navigation will proceed
            });

          void (async () => {
            try {
              await navigate({
                to: resolveRedirect(payload.redirect ?? undefined),
                replace: true,
              });
              complete();
            } catch (navigationError) {
              const navError =
                navigationError instanceof Error
                  ? navigationError
                  : new Error(POPUP_GENERIC_ERROR_MESSAGE);
              complete(navError);
            }
          })();
          return;
        }

        const message =
          data.payload?.message ??
          (data.status === "cancelled"
            ? POPUP_CANCELLED_MESSAGE
            : POPUP_GENERIC_ERROR_MESSAGE);
        if (hasMessageResolved) {
          return;
        }
        hasMessageResolved = true;
        complete(new Error(message));
      };

      messageHandler = handleMessage;
      window.addEventListener("message", handleMessage);

      closeWatcherId = window.setInterval(() => {
        if (hasMessageResolved) {
          return;
        }
        if (!popupRef.current || popupRef.current.closed) {
          complete(new Error(POPUP_CANCELLED_MESSAGE));
        }
      }, POPUP_POLL_INTERVAL_MS);

      timeoutId = window.setTimeout(() => {
        if (hasMessageResolved) {
          return;
        }
        complete(new Error(POPUP_TIMEOUT_MESSAGE));
      }, POPUP_TIMEOUT_MS);
    });
  }, [navigate, queryClient, redirectTo]);

  return {
    login,
    isLoading,
    error,
  };
}

export const GITHUB_POPUP_MESSAGE_CHANNEL = POPUP_MESSAGE_TYPE;

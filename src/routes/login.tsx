import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import loginSubImage from "@/assets/login/login-sub.webp";
import { GithubLoginButton } from "@/features/auth/github-login/ui/github-login-button";
import { useAuthSession } from "@/entities/auth/model/use-auth-session";
import { sanitizeRedirectPath } from "@/shared/lib/navigation/sanitize-redirect-path";
import { PixelPanel } from "@/shared/ui/pixel-panel";

interface LoginSearch {
  redirect?: string;
  authError?: string;
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  AUTH_PROVIDER_DENIED:
    "GitHub 로그인 요청이 취소되었습니다. 다시 시도해주세요.",
  AUTH_REDIRECT_INVALID: "로그인 요청이 만료되었습니다. 다시 시도해주세요.",
  AUTH_SESSION_EXPIRED:
    "세션이 만료되었습니다. 다시 로그인해 Git Dungeon을 계속하세요.",
  AUTH_SESSION_INVALID: "로그인 세션이 유효하지 않습니다. 다시 로그인해주세요.",
  AUTH_PROVIDER_ERROR:
    "로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
};

function resolveAuthErrorMessage(code?: string | null): string | null {
  if (!code) {
    return null;
  }

  const normalized = code.toUpperCase();
  return (
    AUTH_ERROR_MESSAGES[normalized] ??
    "로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
  );
}

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
    authError:
      typeof search.authError === "string" ? search.authError : undefined,
  }),
  beforeLoad: ({ context, location, search }) => {
    const safeRedirect = sanitizeRedirectPath(search.redirect, "/dashboard");

    return context.auth.redirectIfAuthenticated({
      location,
      redirectTo: safeRedirect,
    });
  },
  component: LoginRoute,
});

interface LoginContentProps {
  safeRedirect: string;
  authErrorCode?: string;
}

export function LoginContent({
  safeRedirect,
  authErrorCode,
}: LoginContentProps) {
  const navigate = useNavigate();
  const sessionQuery = useAuthSession();
  const session = sessionQuery.data ?? null;
  const [loginError, setLoginError] = useState<string | null>(() =>
    resolveAuthErrorMessage(authErrorCode)
  );
  const hasRefetchedSessionRef = useRef(false);
  const {
    isSuccess,
    isFetching: sessionIsFetching,
    isRefetching: sessionIsRefetching,
    refetch: refetchSession,
  } = sessionQuery;

  const isPending =
    (sessionQuery as { isPending?: boolean }).isPending ?? false;
  const isFetching = sessionIsFetching ?? false;
  const isRefetching =
    (sessionQuery as { isRefetching?: boolean }).isRefetching ??
    sessionIsRefetching ??
    false;

  useEffect(() => {
    if (!authErrorCode) {
      return;
    }
    setLoginError(resolveAuthErrorMessage(authErrorCode));
  }, [authErrorCode]);

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

  const isCheckingServer = isPending || isFetching || isRefetching;
  const isServerUnavailable = Boolean(sessionQuery.isError);
  const isButtonDisabled = isCheckingServer || isServerUnavailable;

  const status = useMemo(() => {
    if (isCheckingServer) {
      return { text: "서버 확인 중 ...", type: "info" as const };
    }
    if (isServerUnavailable) {
      return {
        text: "서버에 문제가 있어 로그인할 수 없습니다.",
        type: "error" as const,
      };
    }
    if (loginError) {
      return { text: loginError, type: "error" as const };
    }
    return null;
  }, [isCheckingServer, isServerUnavailable, loginError]);

  useEffect(() => {
    if (hasRefetchedSessionRef.current) {
      return;
    }
    if (!isSuccess || session !== null) {
      return;
    }
    if (sessionIsFetching || sessionIsRefetching) {
      return;
    }
    hasRefetchedSessionRef.current = true;
    refetchSession().catch(() => {
      // ignore refetch errors; 상태 메시지로 안내
    });
  }, [
    isSuccess,
    session,
    sessionIsFetching,
    sessionIsRefetching,
    refetchSession,
  ]);

  useEffect(() => {
    if (!session) {
      return;
    }

    void navigate({
      to: safeRedirect,
    });
  }, [navigate, safeRedirect, session]);

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-8 text-center">
      <PixelPanel
        className="w-full"
        contentClassName="items-center text-center gap-6"
      >
        <div className="flex flex-col items-center gap-4">
          <h1 className="font-pixel-title text-3xl sm:text-4xl">GIT DUNGEON</h1>
          <img
            src={loginSubImage}
            alt="Dungeon gate"
            className="w-full max-w-md border-2 border-[#3a2b1b]/60 object-cover shadow-[0_10px_0_rgba(35,23,11,0.6)]"
          />
          <p className="pixel-text-muted pixel-text-sm">
            GitHub 계정으로 로그인하고 자동 탐험을 시작하세요.
          </p>
        </div>
        <div className="flex w-full flex-col items-center gap-3">
          <GithubLoginButton
            redirectTo={safeRedirect}
            onLoginStart={() => {
              if (authErrorCode) {
                clearAuthError();
              }
              setLoginError(null);
            }}
            onLoginError={(error) => setLoginError(error.message)}
            disabled={isButtonDisabled}
            className="pixel-button w-full sm:w-auto"
          >
            GitHub로 계속하기
          </GithubLoginButton>
          {status ? (
            <p
              role={status.type === "info" ? "status" : "alert"}
              aria-live={status.type === "info" ? "polite" : "assertive"}
              className={
                status.type === "info"
                  ? "pixel-text-muted flex items-center justify-center gap-2 text-xs"
                  : "pixel-text-danger text-xs"
              }
            >
              {status.type === "info" ? (
                <>
                  <span className="inline-block h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                  {status.text}
                </>
              ) : (
                status.text
              )}
            </p>
          ) : null}
        </div>
      </PixelPanel>
    </section>
  );
}

function LoginRoute() {
  const { redirect, authError } = Route.useSearch();
  const safeRedirect = sanitizeRedirectPath(redirect, "/dashboard");
  return <LoginContent safeRedirect={safeRedirect} authErrorCode={authError} />;
}

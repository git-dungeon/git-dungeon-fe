import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GithubLoginButton } from "@/features/auth/github-login/ui/github-login-button";
import { useAuthSession } from "@/entities/auth/model/use-auth-session";
import { sanitizeRedirectPath } from "@/shared/lib/navigation/sanitize-redirect-path";

interface LoginSearch {
  redirect?: string;
}

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  beforeLoad: ({ context, location, search }) =>
    context.auth.redirectIfAuthenticated({
      location,
      redirectTo: search.redirect,
    }),
  component: LoginRoute,
});

interface LoginContentProps {
  safeRedirect: string;
}

export function LoginContent({ safeRedirect }: LoginContentProps) {
  const navigate = useNavigate();
  const sessionQuery = useAuthSession();
  const session = sessionQuery.data ?? null;
  const [loginError, setLoginError] = useState<string | null>(null);

  const isPending =
    (sessionQuery as { isPending?: boolean }).isPending ?? false;
  const isFetching = sessionQuery.isFetching ?? false;
  const isRefetching =
    (sessionQuery as { isRefetching?: boolean }).isRefetching ?? false;

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
    if (!session) {
      return;
    }

    void navigate({
      to: safeRedirect,
    });
  }, [navigate, safeRedirect, session]);

  return (
    <section className="mx-auto flex w-full max-w-md flex-col items-center gap-6 text-center">
      <div>
        <h1 className="text-foreground text-3xl font-semibold">Git Dungeon</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          GitHub 계정으로 로그인하고 자동 탐험을 시작하세요.
        </p>
      </div>
      <div className="flex w-full flex-col gap-3">
        <GithubLoginButton
          redirectTo={safeRedirect}
          onLoginStart={() => setLoginError(null)}
          onLoginError={(error) => setLoginError(error.message)}
          disabled={isButtonDisabled}
        >
          GitHub로 계속하기
        </GithubLoginButton>
        {status ? (
          <p
            role={status.type === "info" ? "status" : "alert"}
            aria-live={status.type === "info" ? "polite" : "assertive"}
            className={
              status.type === "info"
                ? "text-muted-foreground flex items-center justify-center gap-2 text-xs"
                : "text-destructive text-xs"
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
    </section>
  );
}

function LoginRoute() {
  const { redirect } = Route.useSearch();
  const safeRedirect = sanitizeRedirectPath(redirect, "/dashboard");
  return <LoginContent safeRedirect={safeRedirect} />;
}

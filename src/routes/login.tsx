import { useEffect, useState } from "react";
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

function LoginRoute() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const { data: session } = useAuthSession();
  const safeRedirect = sanitizeRedirectPath(redirect, "/dashboard");
  const [loginError, setLoginError] = useState<string | null>(null);

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
        >
          GitHub로 계속하기
        </GithubLoginButton>
        {loginError ? (
          <p
            role="alert"
            aria-live="polite"
            className="text-destructive text-xs"
          >
            {loginError}
          </p>
        ) : null}
        <p className="text-muted-foreground text-xs">
          로그인 시 세션 쿠키가 발급되며, GitHub 기여 데이터를 기반으로 AP가
          계산됩니다.
        </p>
      </div>
    </section>
  );
}

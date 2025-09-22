import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GithubLoginButton } from "@/features/auth/github-login/ui/github-login-button";
import { useAuthSession } from "@/entities/auth/model/use-auth-session";

interface LoginSearch {
  redirect?: string;
}

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  component: LoginRoute,
});

function LoginRoute() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const { data: session } = useAuthSession();

  useEffect(() => {
    if (!session) {
      return;
    }

    void navigate({
      to: redirect ?? "/dashboard",
    });
  }, [navigate, redirect, session]);

  return (
    <section className="mx-auto flex w-full max-w-md flex-col items-center gap-6 text-center">
      <div>
        <h1 className="text-foreground text-3xl font-semibold">Git Dungeon</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          GitHub 계정으로 로그인하고 자동 탐험을 시작하세요.
        </p>
      </div>
      <div className="flex w-full flex-col gap-3">
        <GithubLoginButton redirectTo={redirect}>
          GitHub로 계속하기
        </GithubLoginButton>
        <p className="text-muted-foreground text-xs">
          로그인 시 세션 쿠키가 발급되며, GitHub 기여 데이터를 기반으로 AP가
          계산됩니다.
        </p>
      </div>
    </section>
  );
}

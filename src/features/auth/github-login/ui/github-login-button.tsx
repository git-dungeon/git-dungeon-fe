import type { ButtonHTMLAttributes, MouseEvent } from "react";
import { cn } from "@/shared/lib/utils";
import { useGithubLogin } from "@/features/auth/github-login/model/use-github-login";

export interface GithubLoginButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  redirectTo?: string;
}

export function GithubLoginButton(props: GithubLoginButtonProps) {
  const { redirectTo, className, children, ...rest } = props;
  const { login, isLoading } = useGithubLogin({ redirectTo });

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      await login();
    } catch {
      // 오류는 훅 내부에서 관리하거나 상위 컴포넌트에서 처리합니다.
    }
  };

  return (
    <button
      type="button"
      {...rest}
      onClick={handleClick}
      disabled={isLoading || rest.disabled}
      aria-disabled={isLoading || rest.disabled}
      className={cn(
        "bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 items-center justify-center rounded-md px-4 text-sm font-medium transition",
        isLoading ? "pointer-events-none opacity-70" : undefined,
        className
      )}
    >
      {children ?? "GitHub로 계속하기"}
    </button>
  );
}

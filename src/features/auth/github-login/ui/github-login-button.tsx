import type { ButtonHTMLAttributes, MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { useGithubLogin } from "@/features/auth/github-login/model/use-github-login";

export interface GithubLoginButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  redirectTo?: string;
}

export function GithubLoginButton(props: GithubLoginButtonProps) {
  const { redirectTo, className, children, ...rest } = props;
  const handleGithubLogin = useGithubLogin({ redirectTo });

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await handleGithubLogin();
  };

  return (
    <button
      type="button"
      {...rest}
      onClick={handleClick}
      className={cn(
        "bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 items-center justify-center rounded-md px-4 text-sm font-medium transition",
        className
      )}
    >
      {children ?? "GitHub로 계속하기"}
    </button>
  );
}

import type { MouseEvent } from "react";
import { cn } from "@/shared/lib/utils";
import { useGithubLogin } from "@/features/auth/github-login/model/use-github-login";
import { Button, type ButtonProps } from "@/shared/ui/button";

export interface GithubLoginButtonProps extends Omit<ButtonProps, "onClick"> {
  redirectTo?: string;
}

export function GithubLoginButton(props: GithubLoginButtonProps) {
  const {
    redirectTo,
    className,
    children,
    disabled,
    size = "lg",
    ...rest
  } = props;
  const { login, isLoading } = useGithubLogin({ redirectTo });

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      await login();
    } catch {
      // 오류는 훅 내부에서 관리하거나 상위 컴포넌트에서 처리합니다.
    }
  };

  const isDisabled = isLoading || disabled;

  return (
    <Button
      type="button"
      size={size}
      {...rest}
      onClick={handleClick}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={cn(
        isLoading ? "pointer-events-none opacity-70" : undefined,
        className
      )}
    >
      {children ?? "GitHub로 계속하기"}
    </Button>
  );
}

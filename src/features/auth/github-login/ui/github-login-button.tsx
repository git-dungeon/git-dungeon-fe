import type { MouseEvent } from "react";
import { cn } from "@/shared/lib/utils";
import { useGithubLogin } from "@/features/auth/github-login/model/use-github-login";
import { Button, type ButtonProps } from "@/shared/ui/button";

export interface GithubLoginButtonProps extends Omit<ButtonProps, "onClick"> {
  redirectTo?: string;
  onLoginStart?: () => void;
  onLoginError?: (error: Error) => void;
}

export function GithubLoginButton(props: GithubLoginButtonProps) {
  const {
    redirectTo,
    className,
    children,
    disabled,
    size = "lg",
    onLoginStart,
    onLoginError,
    ...rest
  } = props;
  const { login, isLoading } = useGithubLogin({ redirectTo });

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onLoginStart?.();
    try {
      await login();
    } catch (rawError) {
      const fallbackError =
        rawError instanceof Error
          ? rawError
          : new Error(
              "로그인 중 문제가 발생했습니다. 잠시 후 다시 시도하세요."
            );
      onLoginError?.(fallbackError);
    }
  };

  const isDisabled = isLoading || disabled;
  const content = children ?? "GitHub로 계속하기";

  return (
    <Button
      type="button"
      size={size}
      {...rest}
      onClick={handleClick}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={isLoading}
      data-state={isLoading ? "loading" : undefined}
      className={cn(
        "gap-2",
        isLoading ? "pointer-events-none opacity-70" : undefined,
        className
      )}
    >
      {isLoading ? (
        <>
          <span
            aria-hidden="true"
            className="inline-flex h-4 w-4 animate-spin rounded-full border border-current border-t-transparent"
          />
          <span>{content}</span>
          <span className="sr-only">GitHub 로그인 진행 중</span>
        </>
      ) : (
        content
      )}
    </Button>
  );
}

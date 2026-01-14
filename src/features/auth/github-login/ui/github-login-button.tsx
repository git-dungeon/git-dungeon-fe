import type { MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import { useGithubLogin } from "@/features/auth/github-login/model/use-github-login";
import { PixelButton } from "@/shared/ui/pixel-button";
import type { ButtonProps } from "@/shared/ui/button";

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
  const { t } = useTranslation();
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
          : new Error(t("auth.login.errors.generic"));
      onLoginError?.(fallbackError);
    }
  };

  const isDisabled = isLoading || disabled;
  const content = children ?? t("auth.login.button.default");

  return (
    <PixelButton
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
          <span className="sr-only">{t("auth.login.button.loading")}</span>
        </>
      ) : (
        content
      )}
    </PixelButton>
  );
}

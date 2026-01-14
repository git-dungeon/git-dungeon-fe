import type { ReactNode } from "react";
import { GithubLoginButton } from "@/features/auth/github-login/ui/github-login-button";
import { PixelPanel } from "@/shared/ui/pixel-panel";
import { PixelIcon } from "@/shared/ui/pixel-icon";
import type { LoginStatus } from "@/pages/login/model/use-login-state";
import { LoginHero } from "@/widgets/login/ui/login-hero";
import {
  LoginInfoCards,
  type LoginInfoCard,
} from "@/widgets/login/ui/login-info-cards";

interface LoginPageProps {
  safeRedirect: string;
  heroImageSrc: string;
  heroImageAlt: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  cards: LoginInfoCard[];
  status: LoginStatus | null;
  isLoginDisabled: boolean;
  languageControl?: ReactNode;
  onLoginStart: () => void;
  onLoginError: (error: Error) => void;
}

export function LoginPage({
  safeRedirect,
  heroImageSrc,
  heroImageAlt,
  title,
  subtitle,
  ctaLabel,
  cards,
  status,
  isLoginDisabled,
  languageControl,
  onLoginStart,
  onLoginError,
}: LoginPageProps) {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 text-center">
      <PixelPanel
        className="w-full"
        contentClassName="items-center text-center gap-8"
      >
        {languageControl ? (
          <div className="flex w-full justify-end">{languageControl}</div>
        ) : null}
        <LoginHero
          imageSrc={heroImageSrc}
          imageAlt={heroImageAlt}
          title={title}
        />
        <p className="pixel-text-muted pixel-text-sm">{subtitle}</p>
        <div className="flex w-full flex-col items-center gap-3">
          <GithubLoginButton
            redirectTo={safeRedirect}
            onLoginStart={onLoginStart}
            onLoginError={onLoginError}
            disabled={isLoginDisabled}
            className="pixel-button w-full sm:w-auto"
            data-testid="github-login-button"
          >
            <span className="inline-flex items-center gap-2">
              <PixelIcon name="github" size={14} />
              {ctaLabel}
            </span>
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
        <LoginInfoCards cards={cards} />
      </PixelPanel>
    </section>
  );
}

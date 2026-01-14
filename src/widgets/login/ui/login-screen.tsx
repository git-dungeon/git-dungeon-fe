import { useTranslation } from "react-i18next";
import loginSubImage from "@/assets/login/login-sub.webp";
import cardGithubImage from "@/assets/login/git-intergration.webp";
import cardAutoImage from "@/assets/login/auto-exploration.webp";
import cardLootImage from "@/assets/login/epic-loot.webp";
import { GithubLoginButton } from "@/features/auth/github-login/ui/github-login-button";
import { useLanguagePreference } from "@/features/settings/model/use-language-preference";
import { LanguageSelect } from "@/features/settings/ui/language-select";
import { PixelPanel } from "@/shared/ui/pixel-panel";
import { PixelIcon } from "@/shared/ui/pixel-icon";
import { useLoginState } from "@/widgets/login/model/use-login-state";
import { LoginHero } from "@/widgets/login/ui/login-hero";
import { LoginInfoCards } from "@/widgets/login/ui/login-info-cards";

interface LoginScreenProps {
  safeRedirect: string;
  authErrorCode?: string;
}

export function LoginScreen({ safeRedirect, authErrorCode }: LoginScreenProps) {
  const { t } = useTranslation();
  const { status, isLoginDisabled, onLoginStart, onLoginError } = useLoginState(
    { authErrorCode }
  );
  const { language, setLanguage } = useLanguagePreference();

  const cards = [
    {
      image: cardGithubImage,
      title: t("auth.login.cards.github.title"),
      description: t("auth.login.cards.github.description"),
    },
    {
      image: cardAutoImage,
      title: t("auth.login.cards.idle.title"),
      description: t("auth.login.cards.idle.description"),
    },
    {
      image: cardLootImage,
      title: t("auth.login.cards.loot.title"),
      description: t("auth.login.cards.loot.description"),
    },
  ];

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 text-center">
      <PixelPanel
        className="w-full"
        contentClassName="items-center text-center gap-8"
      >
        <div className="flex w-full justify-end">
          <LanguageSelect
            value={language}
            onChange={setLanguage}
            triggerId="login-language"
            ariaLabel={t("settings.preferences.language.label")}
            className="min-w-32"
          />
        </div>
        <LoginHero
          imageSrc={loginSubImage}
          imageAlt={t("auth.login.imageAlt")}
          title="GIT DUNGEON"
        />
        <p className="pixel-text-muted pixel-text-sm">
          {t("auth.login.subtitle")}
        </p>
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
              {t("auth.login.cta")}
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

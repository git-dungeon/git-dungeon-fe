import { useTranslation } from "react-i18next";
import loginSubImage from "@/assets/login/login-sub.webp";
import cardGithubImage from "@/assets/login/git-intergration.webp";
import cardAutoImage from "@/assets/login/auto-exploration.webp";
import cardLootImage from "@/assets/login/epic-loot.webp";
import { useLoginState } from "@/pages/login/model/use-login-state";
import { useLanguagePreference } from "@/features/settings/model/use-language-preference";
import { LanguageSelect } from "@/features/settings/ui/language-select";
import { LoginPage } from "./login-page";

interface LoginContainerProps {
  safeRedirect: string;
  authErrorCode?: string;
}

export function LoginContainer({
  safeRedirect,
  authErrorCode,
}: LoginContainerProps) {
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
  const languageControl = (
    <LanguageSelect
      value={language}
      onChange={setLanguage}
      triggerId="login-language"
      ariaLabel={t("settings.preferences.language.label")}
      className="min-w-32"
    />
  );

  return (
    <LoginPage
      safeRedirect={safeRedirect}
      heroImageSrc={loginSubImage}
      heroImageAlt={t("auth.login.imageAlt")}
      title="GIT DUNGEON"
      subtitle={t("auth.login.subtitle")}
      ctaLabel={t("auth.login.cta")}
      cards={cards}
      status={status}
      isLoginDisabled={isLoginDisabled}
      languageControl={languageControl}
      onLoginStart={onLoginStart}
      onLoginError={onLoginError}
    />
  );
}

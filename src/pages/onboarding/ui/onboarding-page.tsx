import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { PixelPanel } from "@/shared/ui/pixel-panel";
import { PixelButton } from "@/shared/ui/pixel-button";
import { PixelCheckIcon } from "@/shared/ui/pixel-check-icon";
import { normalizeError } from "@/shared/errors/normalize-error";
import { useGithubSyncStatus } from "@/entities/github/model/use-github-sync-status";
import { useGithubSync } from "@/features/settings/model/use-github-sync";

export function OnboardingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const statusQuery = useGithubSyncStatus();
  const githubSync = useGithubSync();

  const status = statusQuery.data ?? null;
  const statusMessage = resolveOnboardingStatusMessage(t, status, {
    isLoading: statusQuery.isLoading,
  });
  const syncErrorMessage = resolveGithubSyncErrorMessage(t, githubSync.error);

  const isConnected = status?.connected ?? true;
  const isAllowed = status?.allowed ?? true;
  const isSyncDisabled =
    githubSync.isPending || statusQuery.isLoading || !isConnected || !isAllowed;

  const helperMessage = useMemo(() => {
    if (syncErrorMessage) {
      return { tone: "error" as const, text: syncErrorMessage };
    }

    if (statusMessage) {
      return { tone: "info" as const, text: statusMessage };
    }

    return {
      tone: "muted" as const,
      text: t("onboarding.hint"),
    };
  }, [statusMessage, syncErrorMessage, t]);

  const handleSync = async () => {
    try {
      await githubSync.mutateAsync();
      await statusQuery.refetch();
      await navigate({ to: "/dashboard" });
    } catch {
      // error is surfaced via githubSync.error
    }
  };

  return (
    <section className="space-y-6">
      <header>
        <h1
          className="font-pixel-title pixel-page-title"
          data-text={t("onboarding.title")}
        >
          {t("onboarding.title")}
        </h1>
      </header>

      <PixelPanel className="px-6 py-10" contentClassName="gap-6">
        <div className="space-y-3 text-center">
          <h2 className="font-pixel-title text-2xl">
            {t("onboarding.headline")}
          </h2>
          <p className="pixel-text-muted mx-auto max-w-2xl text-left text-sm leading-relaxed">
            {t("onboarding.description")}
          </p>
          <ul className="mx-auto max-w-2xl space-y-2 text-left text-sm">
            <li className="flex items-start gap-3">
              <PixelCheckIcon className="mt-0.5 shrink-0" />
              <span className="pixel-text-muted">
                {t("onboarding.apDefinition")}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <PixelCheckIcon className="mt-0.5 shrink-0" />
              <span className="pixel-text-muted">
                {t("onboarding.apCalculation")}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <PixelCheckIcon className="mt-0.5 shrink-0" />
              <span className="pixel-text-muted">
                {t("onboarding.apWindow")}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <PixelCheckIcon className="mt-0.5 shrink-0" />
              <span className="pixel-text-muted">
                {t("onboarding.batchInfo")}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <PixelCheckIcon className="mt-0.5 shrink-0" />
              <span className="pixel-text-muted">
                {t("onboarding.manualSyncInfo")}
              </span>
            </li>
          </ul>
        </div>

        <PixelButton
          type="button"
          className="gap-2 self-center px-10 py-4 text-base"
          disabled={isSyncDisabled}
          onClick={() => void handleSync()}
        >
          {githubSync.isPending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : null}
          {t("onboarding.cta")}
        </PixelButton>

        <p
          className={resolveHelperMessageClassName(helperMessage.tone)}
          role={helperMessage.tone === "error" ? "alert" : undefined}
        >
          {helperMessage.text}
        </p>
      </PixelPanel>
    </section>
  );
}

function resolveOnboardingStatusMessage(
  t: (key: string, options?: Record<string, unknown>) => string,
  status: { connected: boolean; allowed: boolean } | null,
  options: { isLoading: boolean }
): string | null {
  if (options.isLoading) {
    return t("onboarding.status.checking");
  }

  if (!status) {
    return null;
  }

  if (!status.connected) {
    return t("onboarding.status.notConnected");
  }

  if (!status.allowed) {
    return t("onboarding.status.cooldown");
  }

  return null;
}

function resolveGithubSyncErrorMessage(
  t: (key: string) => string,
  error: unknown
): string | null {
  if (!error) {
    return null;
  }

  const appError = normalizeError(error);

  switch (appError.code) {
    case "API_BAD_REQUEST":
      return t("onboarding.errors.notConnected");
    case "AUTH_UNAUTHORIZED":
    case "AUTH_FORBIDDEN":
      return t("onboarding.errors.sessionExpired");
    case "API_RATE_LIMIT":
      return t("onboarding.errors.rateLimited");
    case "API_CONFLICT":
      return t("onboarding.errors.conflict");
    default:
      return t("onboarding.errors.unknown");
  }
}

function resolveHelperMessageClassName(
  tone: "error" | "info" | "muted"
): string {
  if (tone === "error") {
    return "pixel-text-danger text-center text-xs";
  }

  return "pixel-text-muted text-center text-xs";
}

import { createFileRoute } from "@tanstack/react-router";
import { LoginContainer } from "@/pages/login/ui/login-container";
import { NetworkError } from "@/shared/api/http-client";
import { sanitizeRedirectPath } from "@/shared/lib/navigation/sanitize-redirect-path";

interface LoginSearch {
  redirect?: string;
  authError?: string;
}

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
    authError:
      typeof search.authError === "string" ? search.authError : undefined,
  }),
  beforeLoad: ({ context, location, search }) => {
    const safeRedirect = sanitizeRedirectPath(search.redirect, "/dashboard");

    return context.auth.redirectIfAuthenticated({
      location,
      redirectTo: safeRedirect,
    });
  },
  loader: async ({ context }) => {
    try {
      await context.auth.ensureSession();
    } catch (error) {
      if (error instanceof NetworkError) {
        return;
      }
      throw error;
    }
  },
  component: LoginRoute,
});

function LoginRoute() {
  const { redirect, authError } = Route.useSearch();
  const safeRedirect = sanitizeRedirectPath(redirect, "/dashboard");
  return (
    <LoginContainer safeRedirect={safeRedirect} authErrorCode={authError} />
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { LoginScreen } from "@/widgets/login/ui/login-screen";
import { sanitizeRedirectPath } from "@/shared/lib/navigation/sanitize-redirect-path";
import { normalizeError } from "@/shared/errors/normalize-error";

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
      const appError = normalizeError(error);
      if (appError.code.startsWith("NETWORK_")) {
        return;
      }
      throw appError;
    }
  },
  component: LoginRoute,
});

function LoginRoute() {
  const { redirect, authError } = Route.useSearch();
  const safeRedirect = sanitizeRedirectPath(redirect, "/dashboard");
  return <LoginScreen safeRedirect={safeRedirect} authErrorCode={authError} />;
}

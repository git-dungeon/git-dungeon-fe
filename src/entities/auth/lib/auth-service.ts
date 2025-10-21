import { redirect, type ParsedLocation } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import {
  AUTH_SESSION_QUERY_KEY,
  authSessionQueryOptions,
} from "@/entities/auth/model/auth-session-query";
import type { AuthSession } from "@/entities/auth/model/types";
import { sanitizeRedirectPath } from "@/shared/lib/navigation/sanitize-redirect-path";
import { NetworkError } from "@/shared/api/http-client";

interface AuthorizeParams {
  location: ParsedLocation;
  redirectTo?: string;
}

interface RedirectIfAuthenticatedParams {
  location: ParsedLocation;
  redirectTo?: string;
}

export interface AuthService {
  ensureSession(): Promise<AuthSession | null>;
  authorize(params: AuthorizeParams): Promise<AuthSession>;
  redirectIfAuthenticated(params: RedirectIfAuthenticatedParams): Promise<void>;
  setSession(session: AuthSession | null): void;
  invalidateSession(): Promise<void>;
}

function resolveRedirectTarget(location: ParsedLocation, fallback?: string) {
  const locationPath = sanitizeRedirectPath(
    `${location.pathname ?? "/"}${location.searchStr ?? ""}${location.hash ?? ""}`,
    "/"
  );

  if (fallback) {
    return sanitizeRedirectPath(fallback, locationPath);
  }

  return locationPath;
}

export function createAuthService(queryClient: QueryClient): AuthService {
  return {
    async ensureSession() {
      try {
        return await queryClient.ensureQueryData(authSessionQueryOptions);
      } catch (error) {
        if (error instanceof NetworkError) {
          throw error;
        }

        if (import.meta.env.DEV) {
          console.debug("[auth.ensureSession]", {
            reason: "session-fetch-failed",
            error,
          });
        }

        return null;
      }
    },
    async authorize({ location, redirectTo }: AuthorizeParams) {
      let session: AuthSession | null;
      try {
        session = await this.ensureSession();
      } catch (error) {
        if (error instanceof NetworkError) {
          session = null;
        } else {
          throw error;
        }
      }

      if (!session) {
        throw redirect({
          to: "/login",
          search: (prev) => ({
            ...prev,
            redirect: resolveRedirectTarget(location, redirectTo),
          }),
        });
      }

      return session;
    },
    async redirectIfAuthenticated({
      location,
      redirectTo,
    }: RedirectIfAuthenticatedParams) {
      let session: AuthSession | null;
      try {
        session = await this.ensureSession();
      } catch (error) {
        if (error instanceof NetworkError) {
          return;
        }
        throw error;
      }
      if (session) {
        const resolvedRedirect = redirectTo ?? resolveRedirectTarget(location);

        if (import.meta.env.DEV) {
          console.debug("[auth.redirectIfAuthenticated]", {
            reason: "session-exists",
            redirectTo,
            resolvedRedirect,
            location: {
              pathname: location.pathname,
              search: location.searchStr,
              hash: location.hash,
            },
            user: {
              id: session.userId,
              username: session.username,
            },
          });
        }

        throw redirect({
          to: resolvedRedirect,
        });
      }
    },
    setSession(session) {
      queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, session);
    },
    async invalidateSession() {
      queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, null);
      await queryClient.invalidateQueries({ queryKey: AUTH_SESSION_QUERY_KEY });
    },
  };
}

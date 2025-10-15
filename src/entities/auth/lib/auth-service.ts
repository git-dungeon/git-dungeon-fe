import { redirect, type ParsedLocation } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import {
  AUTH_SESSION_QUERY_KEY,
  authSessionQueryOptions,
} from "@/entities/auth/model/auth-session-query";
import type { AuthSession } from "@/entities/auth/model/types";
import { authStore } from "@/entities/auth/model/access-token-store";
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
  setAccessToken(token?: string): void;
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
      return queryClient.ensureQueryData(authSessionQueryOptions);
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
        throw redirect({
          to: redirectTo ?? resolveRedirectTarget(location),
        });
      }
    },
    setSession(session) {
      queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, session);
      if (!session) {
        authStore.clear();
      }
    },
    async invalidateSession() {
      queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, null);
      await queryClient.invalidateQueries({ queryKey: AUTH_SESSION_QUERY_KEY });
      authStore.clear();
    },
    setAccessToken(token) {
      authStore.setAccessToken(token);
    },
  };
}

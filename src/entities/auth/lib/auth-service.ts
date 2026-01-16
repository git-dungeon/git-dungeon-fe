import { redirect, type ParsedLocation } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import {
  AUTH_SESSION_QUERY_KEY,
  authSessionQueryOptions,
} from "@/entities/auth/model/auth-session-query";
import type { AuthSession } from "@/entities/auth/model/types";
import { sanitizeRedirectPath } from "@/shared/lib/navigation/sanitize-redirect-path";
import { isAppError } from "@/shared/errors/app-error";

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

function extractAuthError(location: ParsedLocation): string | null {
  const searchStr = location.searchStr;
  if (!searchStr || !searchStr.includes("authError=")) {
    return null;
  }

  try {
    const params = new URLSearchParams(searchStr);
    const value = params.get("authError");
    return value ?? null;
  } catch {
    return null;
  }
}

function stripAuthErrorParam(path: string): string {
  if (!path || !path.includes("authError")) {
    return path;
  }

  try {
    const base = "http://local";
    const url = new URL(path, base);
    url.searchParams.delete("authError");
    const search = url.searchParams.toString();
    const hash = url.hash ?? "";
    const pathname = url.pathname;
    return `${pathname}${search ? `?${search}` : ""}${hash}`;
  } catch {
    const hashIndex = path.indexOf("#");
    const basePart = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
    const hashPart = hashIndex >= 0 ? path.slice(hashIndex) : "";
    const [pathname, rawSearch = ""] = basePart.split("?");
    const params = new URLSearchParams(rawSearch);
    params.delete("authError");
    const search = params.toString();
    return `${pathname}${search ? `?${search}` : ""}${hashPart}`;
  }
}

export function createAuthService(queryClient: QueryClient): AuthService {
  return {
    async ensureSession() {
      try {
        return await queryClient.ensureQueryData(authSessionQueryOptions);
      } catch (error) {
        if (isAppError(error) && error.code.startsWith("NETWORK_")) {
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
      const authError = extractAuthError(location);
      if (authError) {
        const resolvedRedirect = stripAuthErrorParam(
          resolveRedirectTarget(location, redirectTo)
        );

        throw redirect({
          to: "/login",
          search: {
            redirect: resolvedRedirect,
            authError,
          },
        });
      }

      let session: AuthSession | null;
      try {
        session = await this.ensureSession();
      } catch (error) {
        if (isAppError(error) && error.code.startsWith("NETWORK_")) {
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
            redirect: stripAuthErrorParam(
              resolveRedirectTarget(location, redirectTo)
            ),
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
        if (isAppError(error) && error.code.startsWith("NETWORK_")) {
          return;
        }
        throw error;
      }
      if (session) {
        const resolvedRedirect = stripAuthErrorParam(
          redirectTo ?? resolveRedirectTarget(location)
        );

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

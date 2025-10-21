import { http, HttpResponse } from "msw";
import type { AuthSession } from "@/entities/auth/model/types";
import { AUTH_ENDPOINTS } from "@/shared/config/env";
import {
  MSW_AUTH_COOKIE_KEY,
  MSW_SESSION_COOKIE_KEY,
  decodeSessionCookie,
  encodeSessionCookie,
} from "@/entities/auth/lib/auth-cookie";
import { sanitizeRedirectPath } from "@/shared/lib/navigation/sanitize-redirect-path";
import { respondWithError, respondWithSuccess } from "@/mocks/lib/api-response";

const DEFAULT_SESSION: AuthSession = {
  userId: "user-123",
  username: "mock-user",
  displayName: "Mocked Adventurer",
  avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
  email: "mock-user@example.com",
};

const PROVIDER_DENIED_ERRORS = new Set([
  "access_denied",
  "user_cancelled",
  "user_canceled",
]);

const REDIRECT_INVALID_ERRORS = new Set([
  "state_mismatch",
  "invalid_callback_request",
  "please_restart_the_process",
  "no_code",
  "state_not_found",
]);

function createLoginHeaders(session: AuthSession) {
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    `${MSW_AUTH_COOKIE_KEY}=1; Path=/; SameSite=Lax`
  );
  headers.append(
    "Set-Cookie",
    `${MSW_SESSION_COOKIE_KEY}=${encodeSessionCookie(session)}; Path=/; SameSite=Lax`
  );
  return headers;
}

function createLogoutHeaders() {
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    `${MSW_AUTH_COOKIE_KEY}=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`
  );
  headers.append(
    "Set-Cookie",
    `${MSW_SESSION_COOKIE_KEY}=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`
  );
  headers.set("Cache-Control", "no-store");
  headers.set("Pragma", "no-cache");
  return headers;
}

function resolveRedirectFromUrl(url: string): string {
  const parsedUrl = new URL(url);
  const redirectValue = parsedUrl.searchParams.get("redirect") ?? undefined;
  return sanitizeRedirectPath(redirectValue, "/dashboard");
}

function mapBetterAuthError(rawError: string | null): string {
  if (!rawError) {
    return "AUTH_PROVIDER_ERROR";
  }

  const normalized = rawError.toLowerCase();

  if (PROVIDER_DENIED_ERRORS.has(normalized)) {
    return "AUTH_PROVIDER_DENIED";
  }

  if (REDIRECT_INVALID_ERRORS.has(normalized)) {
    return "AUTH_REDIRECT_INVALID";
  }

  if (rawError.startsWith("AUTH_")) {
    return rawError;
  }

  return "AUTH_PROVIDER_ERROR";
}

function resolveSafeOrigin(_candidate: string | null, fallback: URL): string {
  return `${fallback.protocol}//${fallback.host}`;
}

function createRedirectResponse(location: string, headersInit?: HeadersInit) {
  const headers = new Headers(headersInit);
  headers.set("Location", location);
  headers.set("Cache-Control", "no-store");
  headers.set("Pragma", "no-cache");
  return new HttpResponse(null, {
    status: 302,
    headers,
  });
}

export const authHandlers = [
  http.get(AUTH_ENDPOINTS.session, ({ cookies }) => {
    if (cookies[MSW_AUTH_COOKIE_KEY] !== "1") {
      return respondWithError("Unauthenticated", {
        status: 401,
        code: "AUTH_UNAUTHENTICATED",
      });
    }

    const session = decodeSessionCookie(
      cookies[MSW_SESSION_COOKIE_KEY],
      DEFAULT_SESSION
    );

    return respondWithSuccess(
      {
        session,
        refreshed: false,
      },
      {
        meta: {
          requestId: `msw-auth-${Date.now().toString(36)}`,
        },
      }
    );
  }),
  http.get(AUTH_ENDPOINTS.startGithubOAuth, ({ request }) => {
    const requestUrl = new URL(request.url);
    const safeRedirect = resolveRedirectFromUrl(request.url);
    const session = DEFAULT_SESSION;
    const headers = createLoginHeaders(session);

    const bridgeUrl = new URL(
      AUTH_ENDPOINTS.completeGithubRedirect,
      `${requestUrl.protocol}//${requestUrl.host}`
    );
    bridgeUrl.searchParams.set("redirect", safeRedirect);
    bridgeUrl.searchParams.set("mode", "success");
    bridgeUrl.searchParams.set(
      "origin",
      `${requestUrl.protocol}//${requestUrl.host}`
    );

    return createRedirectResponse(bridgeUrl.toString(), headers);
  }),
  http.get(AUTH_ENDPOINTS.completeGithubRedirect, ({ request }) => {
    const requestUrl = new URL(request.url);
    const safeRedirect = sanitizeRedirectPath(
      requestUrl.searchParams.get("redirect") ?? undefined,
      "/dashboard"
    );
    const mode = (
      requestUrl.searchParams.get("mode") ?? "success"
    ).toLowerCase();
    const origin = resolveSafeOrigin(
      requestUrl.searchParams.get("origin"),
      requestUrl
    );
    const destination = new URL(safeRedirect, origin);

    if (mode === "error") {
      const errorKey = requestUrl.searchParams.get("error");
      destination.searchParams.set("authError", mapBetterAuthError(errorKey));
    }

    return createRedirectResponse(destination.toString());
  }),
  http.post(AUTH_ENDPOINTS.logout, () => {
    return respondWithSuccess(
      { success: true },
      {
        headers: createLogoutHeaders(),
      }
    );
  }),
];

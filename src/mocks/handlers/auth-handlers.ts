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
  return headers;
}

function resolveRedirectFromUrl(url: string): string {
  const parsedUrl = new URL(url);
  const redirectValue = parsedUrl.searchParams.get("redirect") ?? undefined;
  return sanitizeRedirectPath(redirectValue, "/dashboard");
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

    return respondWithSuccess({
      session,
      refreshed: false,
    });
  }),
  http.get(AUTH_ENDPOINTS.startGithubOAuth, ({ request }) => {
    const safeRedirect = resolveRedirectFromUrl(request.url);
    const session = DEFAULT_SESSION;
    const headers = createLoginHeaders(session);
    headers.set("Location", safeRedirect);

    return new HttpResponse(null, {
      status: 302,
      headers,
    });
  }),
  http.post(AUTH_ENDPOINTS.logout, () => {
    return HttpResponse.json(
      { success: true },
      { headers: createLogoutHeaders() }
    );
  }),
];

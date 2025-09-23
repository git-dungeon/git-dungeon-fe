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

const DEFAULT_SESSION: AuthSession = {
  userId: "user-123",
  username: "mock-user",
  displayName: "Mocked Adventurer",
  avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
};

function resolveSession(body: unknown): AuthSession {
  if (!body || typeof body !== "object") {
    return DEFAULT_SESSION;
  }

  const partial = body as Partial<AuthSession>;
  return {
    ...DEFAULT_SESSION,
    ...partial,
  } satisfies AuthSession;
}

function createAccessToken(session: AuthSession) {
  return `mock-access-${session.userId}-${Date.now()}`;
}

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

export const authHandlers = [
  http.get(AUTH_ENDPOINTS.session, ({ cookies }) => {
    if (cookies[MSW_AUTH_COOKIE_KEY] !== "1") {
      return HttpResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const session = decodeSessionCookie(
      cookies[MSW_SESSION_COOKIE_KEY],
      DEFAULT_SESSION
    );

    return HttpResponse.json({
      session,
      accessToken: createAccessToken(session),
    });
  }),
  http.post(AUTH_ENDPOINTS.startGithubOAuth, async ({ request }) => {
    try {
      const rawBody = await request.json();
      const redirectValue =
        typeof rawBody === "object" && rawBody !== null && "redirect" in rawBody
          ? (rawBody as Record<string, unknown>).redirect
          : undefined;
      const safeRedirect = sanitizeRedirectPath(
        typeof redirectValue === "string" ? redirectValue : undefined,
        "/dashboard"
      );
      const session = resolveSession(rawBody);
      return HttpResponse.json(
        {
          session,
          accessToken: createAccessToken(session),
          redirect: safeRedirect,
        },
        { headers: createLoginHeaders(session) }
      );
    } catch {
      return HttpResponse.json(
        {
          session: DEFAULT_SESSION,
          accessToken: createAccessToken(DEFAULT_SESSION),
          redirect: "/dashboard",
        },
        { headers: createLoginHeaders(DEFAULT_SESSION) }
      );
    }
  }),
  http.post(AUTH_ENDPOINTS.logout, () => {
    return HttpResponse.json(
      { success: true },
      { headers: createLogoutHeaders() }
    );
  }),
];

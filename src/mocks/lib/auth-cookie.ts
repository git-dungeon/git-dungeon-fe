import type { AuthSession } from "@/entities/auth/model/types";

export const MSW_AUTH_COOKIE_KEY = "msw-auth";
export const MSW_SESSION_COOKIE_KEY = "msw-auth-session";

export function encodeSessionCookie(session: AuthSession): string {
  return encodeURIComponent(JSON.stringify(session));
}

export function decodeSessionCookie(
  value: string | undefined,
  fallback: AuthSession
): AuthSession {
  if (!value) {
    return fallback;
  }

  try {
    const decoded = decodeURIComponent(value);
    const parsed = JSON.parse(decoded) as Partial<AuthSession>;
    return {
      ...fallback,
      ...parsed,
    } satisfies AuthSession;
  } catch {
    return fallback;
  }
}

export function writeAuthCookies(session: AuthSession) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${MSW_AUTH_COOKIE_KEY}=1; path=/; SameSite=Lax`;
  document.cookie = `${MSW_SESSION_COOKIE_KEY}=${encodeSessionCookie(session)}; path=/; SameSite=Lax`;
}

export function clearAuthCookies() {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${MSW_AUTH_COOKIE_KEY}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  document.cookie = `${MSW_SESSION_COOKIE_KEY}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

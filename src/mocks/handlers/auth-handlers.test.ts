import { describe, expect, it } from "vitest";
import { AUTH_ENDPOINTS } from "@/shared/config/env";

function getSetCookieHeaders(response: Response): string[] {
  const headers = response.headers as unknown as {
    getSetCookie?: () => string[];
    raw?: () => Record<string, string[]>;
  };

  if (typeof headers.getSetCookie === "function") {
    return headers.getSetCookie();
  }

  const raw = headers.raw?.();
  if (!raw) {
    const single = response.headers.get("set-cookie");
    return single ? [single] : [];
  }

  return raw["set-cookie"] ?? [];
}

describe("authHandlers (MSW)", () => {
  const baseUrl = window.location?.origin ?? "http://localhost";

  it("/auth/github는 브리지 리다이렉트와 세션 쿠키를 설정한다", async () => {
    const response = await fetch(
      `${baseUrl}${AUTH_ENDPOINTS.startGithubOAuth}?redirect=${encodeURIComponent("/inventory")}`,
      {
        redirect: "manual",
      }
    );

    expect(response.status).toBe(302);
    const location = response.headers.get("Location");
    expect(location).toContain(AUTH_ENDPOINTS.completeGithubRedirect);
    expect(location).toContain("mode=success");
    expect(location).toContain("redirect=%2Finventory");

    const setCookieHeaders = getSetCookieHeaders(response);
    expect(
      setCookieHeaders.some((value) => value.startsWith("msw-auth=1"))
    ).toBe(true);
    expect(
      setCookieHeaders.some((value) => value.startsWith("msw-auth-session="))
    ).toBe(true);
  });

  it("/auth/github/redirect 성공 응답은 최종 경로로 이동시킨다", async () => {
    const response = await fetch(
      `${baseUrl}${AUTH_ENDPOINTS.completeGithubRedirect}?mode=success&redirect=${encodeURIComponent("/dashboard")}&origin=${encodeURIComponent(baseUrl)}`,
      {
        redirect: "manual",
      }
    );

    expect(response.status).toBe(302);
    const location = response.headers.get("Location");
    expect(location).toBe(`${baseUrl}/dashboard`);
  });

  it("/auth/github/redirect 오류 응답은 authError 쿼리를 포함한다", async () => {
    const response = await fetch(
      `${baseUrl}${AUTH_ENDPOINTS.completeGithubRedirect}?mode=error&error=access_denied&redirect=${encodeURIComponent("https://malicious.example.com")}&origin=${encodeURIComponent("https://malicious.example.com")}`,
      {
        redirect: "manual",
      }
    );

    expect(response.status).toBe(302);
    const location = response.headers.get("Location");
    expect(location).toBe(
      `${baseUrl}/dashboard?authError=AUTH_PROVIDER_DENIED`
    );
  });
});

import { http } from "msw";
import { describe, expect, it } from "vitest";
import { AUTH_ENDPOINTS } from "@/shared/config/env";
import { getAuthSession } from "@/entities/auth/api/get-auth-session";
import { authStore } from "@/entities/auth/model/access-token-store";
import { respondWithError, respondWithSuccess } from "@/mocks/lib/api-response";
import { server } from "@/mocks/tests/server";

const sessionUrl = new URL(
  AUTH_ENDPOINTS.session,
  "http://localhost"
).toString();

describe("getAuthSession", () => {
  it("세션 정보와 액세스 토큰을 저장한다", async () => {
    server.use(
      http.get(sessionUrl, () =>
        respondWithSuccess({
          session: {
            userId: "test-user",
            username: "tester",
            displayName: "Tester",
          },
          accessToken: "token-123",
        })
      )
    );

    const session = await getAuthSession();

    expect(session).toEqual({
      userId: "test-user",
      username: "tester",
      displayName: "Tester",
    });
    expect(authStore.getAccessToken()).toBe("token-123");
  });

  it("401 응답 시 null을 반환하고 액세스 토큰을 초기화한다", async () => {
    authStore.setAccessToken("stale-token");
    server.use(
      http.get(sessionUrl, () =>
        respondWithError("Unauthorized", {
          status: 401,
          code: "AUTH_UNAUTHORIZED",
        })
      )
    );

    const session = await getAuthSession();

    expect(session).toBeNull();
    expect(authStore.getAccessToken()).toBeUndefined();
  });
});

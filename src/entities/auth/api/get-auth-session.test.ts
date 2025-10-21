import { http } from "msw";
import { describe, expect, it, vi } from "vitest";
import { AUTH_ENDPOINTS } from "@/shared/config/env";
import { getAuthSession } from "@/entities/auth/api/get-auth-session";
import { respondWithError, respondWithSuccess } from "@/mocks/lib/api-response";
import { server } from "@/mocks/tests/server";
import * as httpClient from "@/shared/api/http-client";
import { NetworkError } from "@/shared/api/http-client";

describe("getAuthSession", () => {
  it("세션 정보를 반환한다", async () => {
    server.use(
      http.get(AUTH_ENDPOINTS.session, () =>
        respondWithSuccess({
          session: {
            userId: "test-user",
            username: "tester",
            displayName: "Tester",
            email: "tester@example.com",
          },
          refreshed: false,
        })
      )
    );

    const session = await getAuthSession();

    expect(session).toEqual({
      userId: "test-user",
      username: "tester",
      displayName: "Tester",
      email: "tester@example.com",
    });
  });

  it("401 응답 시 null을 반환한다", async () => {
    server.use(
      http.get(AUTH_ENDPOINTS.session, () =>
        respondWithError("Unauthorized", {
          status: 401,
          code: "AUTH_UNAUTHORIZED",
        })
      )
    );

    const session = await getAuthSession();

    expect(session).toBeNull();
  });

  it("success: false 응답 시 null을 반환한다", async () => {
    server.use(
      http.get(AUTH_ENDPOINTS.session, () =>
        respondWithError("TokenExpired", {
          status: 200,
          code: "AUTH_TOKEN_EXPIRED",
        })
      )
    );

    const session = await getAuthSession();

    expect(session).toBeNull();
  });

  it("네트워크 오류 시 NetworkError를 던진다", async () => {
    const requestWithSchemaSpy = vi
      .spyOn(httpClient, "requestWithSchema")
      .mockRejectedValueOnce(new NetworkError());

    await expect(getAuthSession()).rejects.toBeInstanceOf(NetworkError);

    requestWithSchemaSpy.mockRestore();
  });
});

import { describe, expect, it } from "vitest";
import { http } from "msw";
import { server } from "@/mocks/tests/server";
import { respondWithError, respondWithSuccess } from "@/mocks/lib/api-response";
import { GITHUB_ENDPOINTS } from "@/shared/config/env";
import { ApiError } from "@/shared/api/http-client";
import { postGithubSync } from "./post-github-sync";

describe("postGithubSync", () => {
  it("성공 시 GithubSyncData를 반환한다", async () => {
    server.use(
      http.post(GITHUB_ENDPOINTS.sync, () =>
        respondWithSuccess({
          contributions: 3,
          windowStart: "2025-11-20T00:00:00.000Z",
          windowEnd: "2025-11-20T06:00:00.000Z",
          tokenType: "oauth",
          rateLimitRemaining: 50,
          logId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          meta: {
            remaining: 50,
            resetAt: 1732106400000,
            resource: null,
          },
        })
      )
    );

    const data = await postGithubSync();

    expect(data.tokenType).toBe("oauth");
    expect(data.logId).toBeTypeOf("string");
  });

  it("409 응답은 ApiError(409)를 던진다", async () => {
    server.use(
      http.post(GITHUB_ENDPOINTS.sync, () =>
        respondWithError("쿨다운입니다.", {
          status: 409,
          code: "GITHUB_SYNC_TOO_FREQUENT",
        })
      )
    );

    await expect(postGithubSync()).rejects.toMatchObject({
      name: "ApiError",
      status: 409,
    });
  });

  it("400 응답은 ApiError(400)를 던진다", async () => {
    server.use(
      http.post(GITHUB_ENDPOINTS.sync, () =>
        respondWithError("미연결입니다.", {
          status: 400,
          code: "GITHUB_NOT_CONNECTED",
        })
      )
    );

    try {
      await postGithubSync();
      throw new Error("Expected postGithubSync to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).status).toBe(400);
      const payload = (error as ApiError).payload as
        | { error?: { code?: string } }
        | undefined;
      expect(payload?.error?.code).toBe("GITHUB_NOT_CONNECTED");
    }
  });
});

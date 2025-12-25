import { describe, expect, it } from "vitest";
import { http } from "msw";
import { server } from "@/mocks/tests/server";
import { respondWithSuccess } from "@/mocks/lib/api-response";
import { GITHUB_ENDPOINTS } from "@/shared/config/env";
import { getGithubSyncStatus } from "./get-github-sync-status";

describe("getGithubSyncStatus", () => {
  it("동기화 가능 여부를 반환한다", async () => {
    server.use(
      http.get(GITHUB_ENDPOINTS.status, () =>
        respondWithSuccess({
          connected: true,
          allowed: false,
          cooldownMs: 21600000,
          lastSyncAt: "2025-12-15T00:00:00.000Z",
          nextAvailableAt: "2025-12-15T06:00:00.000Z",
          retryAfterMs: 1000,
        })
      )
    );

    const data = await getGithubSyncStatus();

    expect(data.connected).toBe(true);
    expect(data.allowed).toBe(false);
    expect(data.nextAvailableAt).toBeTypeOf("string");
  });
});

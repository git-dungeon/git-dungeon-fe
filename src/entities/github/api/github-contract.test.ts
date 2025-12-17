import { describe, expect, it } from "vitest";
import { ApiError } from "@/shared/api/http-client";
import { getGithubSyncStatus } from "./get-github-sync-status";
import { postGithubSync } from "./post-github-sync";

describe("github sync (contract)", () => {
  it("기본 MSW 핸들러 기준으로 status/sync가 스키마/상태코드 계약을 만족한다", async () => {
    const status = await getGithubSyncStatus();

    expect(status.connected).toBeTypeOf("boolean");
    expect(status.allowed).toBeTypeOf("boolean");

    if (status.allowed) {
      const data = await postGithubSync();
      expect(data.tokenType).toMatch(/^(oauth|pat)$/);
      return;
    }

    await expect(postGithubSync()).rejects.toMatchObject({
      name: "ApiError",
      status: 409,
    } satisfies Partial<ApiError>);
  });
});

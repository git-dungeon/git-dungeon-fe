import { describe, expect, it, vi } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { ensureOnboardingComplete } from "./ensure-onboarding-complete";
import { GITHUB_SYNC_STATUS_QUERY_KEY } from "@/entities/github/model/github-sync-status-query";
import type { GithubSyncStatusData } from "@/entities/github/model/types";

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    redirect: (options: unknown) =>
      Object.assign(new Error("redirect"), { __redirect: options }),
  };
});

vi.mock("@/shared/lib/query/ensure-query-data-safe", () => ({
  ensureQueryDataSafe: vi.fn().mockResolvedValue(undefined),
}));

function createStatus(
  overrides?: Partial<GithubSyncStatusData>
): GithubSyncStatusData {
  return {
    connected: true,
    allowed: true,
    cooldownMs: 0,
    lastSyncAt: null,
    lastManualSyncAt: null,
    nextAvailableAt: null,
    retryAfterMs: null,
    ...overrides,
  };
}

describe("ensureOnboardingComplete", () => {
  it("상태가 없으면 리다이렉트하지 않는다", async () => {
    const queryClient = new QueryClient();

    await expect(
      ensureOnboardingComplete(queryClient)
    ).resolves.toBeUndefined();
  });

  it("수동 동기화가 없으면 온보딩으로 리다이렉트한다", async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(GITHUB_SYNC_STATUS_QUERY_KEY, createStatus());

    await expect(ensureOnboardingComplete(queryClient)).rejects.toMatchObject({
      message: "redirect",
      __redirect: expect.objectContaining({ to: "/onboarding" }),
    });
  });

  it("수동 동기화가 있으면 통과한다", async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(
      GITHUB_SYNC_STATUS_QUERY_KEY,
      createStatus({ lastManualSyncAt: "2026-01-12T02:00:00.000Z" })
    );

    await expect(
      ensureOnboardingComplete(queryClient)
    ).resolves.toBeUndefined();
  });
});

import { describe, expect, it, vi } from "vitest";
import { ensureQueryDataSafe } from "@/shared/lib/query/ensure-query-data-safe";

describe("ensureQueryDataSafe", () => {
  it("fetch 네트워크 TypeError(Failed to fetch)는 무시한다", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const queryClient = {
      ensureQueryData: async () => {
        throw new TypeError("Failed to fetch");
      },
    } as unknown as Parameters<typeof ensureQueryDataSafe>[0];

    await expect(
      ensureQueryDataSafe(queryClient, {
        queryKey: ["catalog", "default"],
        queryFn: async () => "ok",
      })
    ).resolves.toBeUndefined();

    warnSpy.mockRestore();
  });

  it("네트워크가 아닌 TypeError는 그대로 던진다", async () => {
    const queryClient = {
      ensureQueryData: async () => {
        throw new TypeError("Cannot read properties of undefined");
      },
    } as unknown as Parameters<typeof ensureQueryDataSafe>[0];

    await expect(
      ensureQueryDataSafe(queryClient, {
        queryKey: ["catalog", "default"],
        queryFn: async () => "ok",
      })
    ).rejects.toBeInstanceOf(TypeError);
  });
});

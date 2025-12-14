import { describe, expect, it } from "vitest";
import { ApiError } from "@/shared/api/http-client";
import { getDungeonLogs } from "./get-dungeon-logs";

describe("getDungeonLogs", () => {
  it("cursor 페이지네이션을 nextCursor로 진행한다", async () => {
    const first = await getDungeonLogs({ limit: 1 });

    expect(first.logs).toHaveLength(1);
    expect(first.nextCursor).toBeTypeOf("string");

    const second = await getDungeonLogs({
      limit: 1,
      cursor: first.nextCursor ?? undefined,
    });

    expect(second.logs).toHaveLength(1);
    expect(second.logs[0]?.id).not.toBe(first.logs[0]?.id);
  });

  it("type=EXPLORATION 필터가 적용된다", async () => {
    const data = await getDungeonLogs({ limit: 50, type: "EXPLORATION" });
    expect(data.logs.every((log) => log.category === "EXPLORATION")).toBe(true);
  });

  it("type=BATTLE 필터가 적용된다", async () => {
    const data = await getDungeonLogs({ limit: 50, type: "BATTLE" });
    expect(data.logs.every((log) => log.action === "BATTLE")).toBe(true);
  });

  it("type=REVIVE 필터가 적용된다", async () => {
    const data = await getDungeonLogs({ limit: 50, type: "REVIVE" });
    expect(data.logs.every((log) => log.action === "REVIVE")).toBe(true);
  });

  it("잘못된 쿼리(limit=0)는 400 LOGS_INVALID_QUERY로 처리된다", async () => {
    try {
      await getDungeonLogs({ limit: 0 });
      throw new Error("Expected getDungeonLogs to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).status).toBe(400);
      const payload = (error as ApiError).payload as
        | { error?: { code?: string } }
        | undefined;
      expect(payload?.error?.code).toBe("LOGS_INVALID_QUERY");
    }
  });
});

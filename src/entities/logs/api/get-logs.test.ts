import { describe, expect, it } from "vitest";
import { isAppError } from "@/shared/errors/app-error";
import { mockTimestampMinutesAgo } from "@/mocks/handlers/shared/time";
import { getLogs } from "./get-logs";

describe("getLogs", () => {
  it("cursor 페이지네이션을 nextCursor로 진행한다", async () => {
    const first = await getLogs({ limit: 1 });

    expect(first.logs).toHaveLength(1);
    expect(first.nextCursor).toBeTypeOf("string");

    const second = await getLogs({
      limit: 1,
      cursor: first.nextCursor ?? undefined,
    });

    expect(second.logs).toHaveLength(1);
    expect(second.logs[0]?.id).not.toBe(first.logs[0]?.id);
  });

  it("type=EXPLORATION 필터가 적용된다", async () => {
    const data = await getLogs({ limit: 50, type: "EXPLORATION" });
    expect(data.logs.every((log) => log.category === "EXPLORATION")).toBe(true);
  });

  it("type=BATTLE 필터가 적용된다", async () => {
    const data = await getLogs({ limit: 50, type: "BATTLE" });
    expect(data.logs.every((log) => log.action === "BATTLE")).toBe(true);
  });

  it("type=REVIVE 필터가 적용된다", async () => {
    const data = await getLogs({ limit: 50, type: "REVIVE" });
    expect(data.logs.every((log) => log.action === "REVIVE")).toBe(true);
  });

  it("type=EMPTY 필터가 적용된다", async () => {
    const data = await getLogs({ limit: 50, type: "EMPTY" });
    expect(data.logs.every((log) => log.action === "EMPTY")).toBe(true);
  });

  it("from/to 날짜 범위 필터가 적용된다", async () => {
    const from = mockTimestampMinutesAgo(4);
    const to = mockTimestampMinutesAgo(2);
    const data = await getLogs({ from, to });
    const fromTime = Date.parse(from);
    const toTime = Date.parse(to);

    expect(data.logs).not.toHaveLength(0);
    data.logs.forEach((log) => {
      const timestamp = Date.parse(log.createdAt);
      expect(timestamp).toBeGreaterThanOrEqual(fromTime);
      expect(timestamp).toBeLessThanOrEqual(toTime);
    });
  });

  it("잘못된 쿼리(limit=0)는 400 LOGS_INVALID_QUERY로 처리된다", async () => {
    try {
      await getLogs({ limit: 0 });
      throw new Error("Expected getLogs to throw");
    } catch (error) {
      expect(isAppError(error)).toBe(true);
      if (!isAppError(error)) return;
      expect(error.code).toBe("API_BAD_REQUEST");
      const payload = error.meta?.payload as
        | { error?: { code?: string } }
        | undefined;
      expect(payload?.error?.code).toBe("LOGS_INVALID_QUERY");
    }
  });
});

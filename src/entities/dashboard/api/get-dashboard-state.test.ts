import { describe, expect, it } from "vitest";
import { getDashboardState } from "./get-dashboard-state";

describe("getDashboardState (contract)", () => {
  it("기본 MSW 핸들러 응답을 스키마로 파싱한다", async () => {
    const state = await getDashboardState();

    expect(state.userId).toBeTypeOf("string");
    expect(state.level).toBeTypeOf("number");
    expect(Array.isArray(state.equippedItems)).toBe(true);
  });
});

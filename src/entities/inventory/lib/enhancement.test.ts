import { describe, expect, it } from "vitest";
import {
  formatEnhancementStars,
  resolveEnhancementBonus,
  resolveEnhancementLevel,
} from "./enhancement";

describe("inventory enhancement helpers", () => {
  it("강화 레벨은 0 이상 정수로 보정한다", () => {
    expect(resolveEnhancementLevel(undefined)).toBe(0);
    expect(resolveEnhancementLevel(-2)).toBe(0);
    expect(resolveEnhancementLevel(3.8)).toBe(3);
  });

  it("강화 별 문자열을 만든다", () => {
    expect(formatEnhancementStars(0)).toBeNull();
    expect(formatEnhancementStars(4)).toBe("★4");
  });

  it("슬롯별 강화 보너스를 계산한다", () => {
    expect(resolveEnhancementBonus("weapon", 2)).toEqual({
      stat: "atk",
      value: 2,
    });
    expect(resolveEnhancementBonus("armor", 3)).toEqual({
      stat: "def",
      value: 3,
    });
    expect(resolveEnhancementBonus("material", 5)).toBeNull();
  });
});

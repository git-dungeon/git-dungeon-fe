import { describe, expect, it } from "vitest";
import { resolveLocalItemSprite, MISSING_SPRITE } from "./local-sprites";

describe("resolveLocalItemSprite", () => {
  it("material 코드가 있으면 misc 스프라이트를 반환한다", () => {
    const sprite = resolveLocalItemSprite("material-metal-scrap");

    expect(sprite).toBeTruthy();
    expect(sprite).not.toBe(MISSING_SPRITE);
  });

  it("알 수 없는 코드면 missing 스프라이트를 반환한다", () => {
    const sprite = resolveLocalItemSprite("unknown-code");
    expect(sprite).toBe(MISSING_SPRITE);
  });
});

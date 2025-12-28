import { afterEach, describe, expect, it, vi } from "vitest";
import { i18next } from "@/shared/i18n/i18n";
import {
  getLanguagePreference,
  setLanguagePreference,
} from "@/shared/lib/preferences/preferences";

describe("i18n", () => {
  const originalLanguage = getLanguagePreference();

  afterEach(() => {
    setLanguagePreference(originalLanguage);
  });

  it("언어 선호도가 변경되면 i18n 언어와 문구가 갱신된다", async () => {
    const nextLanguage = originalLanguage === "ko" ? "en" : "ko";
    const changeSpy = vi.spyOn(i18next, "changeLanguage");

    setLanguagePreference(nextLanguage);

    expect(changeSpy).toHaveBeenCalledWith(nextLanguage);

    const changeResult = changeSpy.mock.results.at(-1)?.value;
    if (changeResult instanceof Promise) {
      await changeResult;
    }

    const expectedTitle = nextLanguage === "ko" ? "설정" : "Settings";
    expect(i18next.language).toBe(nextLanguage);
    expect(i18next.t("settings.title")).toBe(expectedTitle);

    changeSpy.mockRestore();
  });
});

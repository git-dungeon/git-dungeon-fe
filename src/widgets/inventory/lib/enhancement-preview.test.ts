import { describe, expect, it } from "vitest";
import type { CatalogEnhancementConfig } from "@/entities/catalog/model/types";
import { buildEnhancementPreview } from "./enhancement-preview";

const enhancementConfigFixture: CatalogEnhancementConfig = {
  maxLevel: 10,
  successRates: {
    "1": 1,
    "2": 0.95,
  },
  goldCosts: {
    "1": 5,
    "2": 10,
  },
  materialCounts: {
    "1": 1,
    "2": 2,
  },
  materialsBySlot: {
    weapon: "material-metal-scrap",
    armor: "material-cloth-scrap",
    helmet: "material-leather-scrap",
    ring: "material-mithril-dust",
  },
};

describe("buildEnhancementPreview", () => {
  it("강화 가능 슬롯이면 다음 단계 비용/확률/보너스를 계산한다", () => {
    const preview = buildEnhancementPreview(
      "weapon",
      0,
      enhancementConfigFixture
    );

    expect(preview).toMatchObject({
      slot: "weapon",
      currentLevel: 0,
      nextLevel: 1,
      isMaxLevel: false,
      successRate: 1,
      goldCost: 5,
      materialCount: 1,
      materialCode: "material-metal-scrap",
      bonusStat: "atk",
      currentBonus: 0,
      nextBonus: 1,
    });
  });

  it("최대 레벨이면 비용/확률은 null로 반환한다", () => {
    const preview = buildEnhancementPreview(
      "ring",
      10,
      enhancementConfigFixture
    );

    expect(preview).toMatchObject({
      slot: "ring",
      currentLevel: 10,
      nextLevel: 10,
      isMaxLevel: true,
      successRate: null,
      goldCost: null,
      materialCount: null,
      materialCode: null,
      bonusStat: "luck",
      currentBonus: 10,
      nextBonus: 10,
    });
  });

  it("강화 불가 슬롯이면 null을 반환한다", () => {
    const preview = buildEnhancementPreview(
      "material",
      0,
      enhancementConfigFixture
    );

    expect(preview).toBeNull();
  });
});

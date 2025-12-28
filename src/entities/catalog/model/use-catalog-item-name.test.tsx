import React, { StrictMode, act } from "react";
import { createRoot } from "react-dom/client";
import { beforeAll, describe, expect, it, vi } from "vitest";
import type { CatalogData } from "@/entities/catalog/model/types";
import { useCatalogItemNameResolver } from "./use-catalog-item-name";

const useCatalogMock = vi.fn();

vi.mock("@/entities/catalog/model/use-catalog", () => ({
  useCatalog: () => useCatalogMock(),
}));

vi.mock("@/features/settings/model/use-language-preference", () => ({
  useLanguagePreference: () => ({ language: "ko", setLanguage: vi.fn() }),
}));

function render(ui: React.ReactElement) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(<StrictMode>{ui}</StrictMode>);
  });

  return {
    container,
    unmount: () => {
      act(() => root.unmount());
      container.remove();
    },
  };
}

function NameProbe({
  code,
  fallback,
}: {
  code: string;
  fallback?: string | null;
}) {
  const resolveName = useCatalogItemNameResolver();
  return <div data-testid="name">{resolveName(code, fallback)}</div>;
}

const catalogFixture: CatalogData = {
  version: 1,
  updatedAt: "2025-12-28T00:00:00.000Z",
  items: [
    {
      code: "ring-copper-band",
      nameKey: "items.ring.copper",
      descriptionKey: null,
      name: "구리 반지",
      slot: "ring",
      rarity: "common",
      modifiers: [],
      effectCode: null,
      spriteId: "ring-copper-band",
      description: null,
    },
  ],
  buffs: [],
  monsters: [],
  assetsBaseUrl: null,
  spriteMap: null,
};

beforeAll(() => {
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
});

describe("useCatalogItemNameResolver", () => {
  it("카탈로그 데이터가 있으면 아이템 이름을 반환한다", () => {
    useCatalogMock.mockReturnValue({ data: catalogFixture });

    const { container, unmount } = render(
      <NameProbe code="ring-copper-band" fallback="ring-copper-band" />
    );

    expect(container.textContent).toContain("구리 반지");

    unmount();
  });

  it("카탈로그 데이터가 없으면 fallback을 사용한다", () => {
    useCatalogMock.mockReturnValue({ data: null });

    const { container, unmount } = render(
      <NameProbe code="ring-copper-band" fallback="ring-copper-band" />
    );

    expect(container.textContent).toContain("ring-copper-band");

    unmount();
  });
});

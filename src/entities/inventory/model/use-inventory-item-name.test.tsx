import React, { StrictMode, act } from "react";
import { createRoot } from "react-dom/client";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { i18next } from "@/shared/i18n/i18n";
import { useInventoryItemNameResolver } from "./use-inventory-item-name";

const useCatalogItemNameResolverMock = vi.fn();

vi.mock("@/entities/catalog/model/use-catalog-item-name", () => ({
  useCatalogItemNameResolver: () => useCatalogItemNameResolverMock(),
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

function NameProbe({ code }: { code: string }) {
  const resolveName = useInventoryItemNameResolver();
  return <div data-testid="name">{resolveName(code, null)}</div>;
}

beforeAll(async () => {
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
  await i18next.changeLanguage("ko");
});

describe("useInventoryItemNameResolver", () => {
  it("카탈로그 이름이 없으면 i18n fallback(inventory.items.*)을 사용한다", () => {
    useCatalogItemNameResolverMock.mockReturnValue((code: string) => code);

    const { container, unmount } = render(
      <NameProbe code="material-metal-scrap" />
    );

    expect(container.textContent).toContain("금속 파편");

    unmount();
  });

  it("i18n에도 없으면 code를 그대로 반환한다", () => {
    useCatalogItemNameResolverMock.mockReturnValue((code: string) => code);

    const { container, unmount } = render(<NameProbe code="unknown-code" />);

    expect(container.textContent).toContain("unknown-code");

    unmount();
  });
});

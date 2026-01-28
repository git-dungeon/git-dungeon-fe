import React, { StrictMode, act } from "react";
import { createRoot } from "react-dom/client";
import { beforeAll, describe, expect, it, vi } from "vitest";
import type { InventoryItem } from "@/entities/inventory/model/types";
import { InventoryModal } from "./inventory-modal";

vi.mock("@/entities/inventory/model/use-inventory-item-name", () => ({
  useInventoryItemNameResolver: () => {
    return (code: string, fallback?: string | null) => fallback ?? code;
  },
}));

vi.mock("@/entities/catalog/model/use-catalog-item-description", () => ({
  useCatalogItemDescriptionResolver: () => {
    return () => null;
  },
}));

function render(ui: React.ReactElement) {
  const app = document.createElement("div");
  app.className = "pixel-app";
  document.body.appendChild(app);
  const root = createRoot(app);

  act(() => {
    root.render(<StrictMode>{ui}</StrictMode>);
  });

  return {
    container: app,
    unmount: () => {
      act(() => root.unmount());
      app.remove();
    },
  };
}

function findButton(root: Element, label: string) {
  return Array.from(root.querySelectorAll("button")).find((button) =>
    (button.textContent ?? "").includes(label)
  ) as HTMLButtonElement | undefined;
}

beforeAll(() => {
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
});

describe("InventoryModal", () => {
  const baseItem: InventoryItem = {
    id: "item-1",
    code: "weapon-wooden-sword",
    name: "Wooden Sword",
    slot: "weapon",
    rarity: "epic",
    modifiers: [],
    effect: null,
    sprite: null,
    createdAt: "2026-01-28T00:00:00.000Z",
    isEquipped: false,
    quantity: 1,
    version: 1,
  };

  it("장착 중이면 분해 버튼이 비활성화된다", () => {
    const { container, unmount } = render(
      <InventoryModal
        item={{ ...baseItem, isEquipped: true }}
        slot="weapon"
        isPending={false}
        isSyncing={false}
        error={null}
        onClose={() => undefined}
        onEquip={async () => undefined}
        onUnequip={async () => undefined}
        onDiscard={async () => undefined}
        onDismantle={async () => undefined}
        onClearError={() => undefined}
        dismantleError={null}
      />
    );

    const modalRoot = container.querySelector(".pixel-modal.max-w-xl");
    expect(modalRoot).not.toBeNull();
    const dismantleButton = modalRoot
      ? findButton(modalRoot, "분해")
      : undefined;

    expect(dismantleButton).toBeDefined();
    expect(dismantleButton?.disabled).toBe(true);

    unmount();
  });

  it("분해 버튼 클릭 시 분해 확인 모달이 열리고 예상 결과를 표시한다", async () => {
    const { container, unmount } = render(
      <InventoryModal
        item={baseItem}
        slot="weapon"
        isPending={false}
        isSyncing={false}
        error={null}
        onClose={() => undefined}
        onEquip={async () => undefined}
        onUnequip={async () => undefined}
        onDiscard={async () => undefined}
        onDismantle={async () => undefined}
        onClearError={() => undefined}
        dismantleError={null}
      />
    );

    const modalRoot = container.querySelector(".pixel-modal.max-w-xl");
    expect(modalRoot).not.toBeNull();
    const dismantleButton = modalRoot
      ? findButton(modalRoot, "분해")
      : undefined;
    expect(dismantleButton).toBeDefined();

    await act(async () => {
      dismantleButton?.dispatchEvent(
        new MouseEvent("click", { bubbles: true })
      );
    });

    const dismantleDialog = container.querySelector(".pixel-modal.max-w-2xl");
    expect(dismantleDialog).not.toBeNull();
    expect(dismantleDialog?.textContent).toContain("예상 결과");
    expect(dismantleDialog?.textContent).toContain("x4");

    unmount();
  });

  it("분해 확인 클릭 시 onDismantle 호출 후 모달을 닫는다", async () => {
    const onClose = vi.fn();
    const onDismantle = vi.fn().mockResolvedValue(undefined);

    const { container, unmount } = render(
      <InventoryModal
        item={baseItem}
        slot="weapon"
        isPending={false}
        isSyncing={false}
        error={null}
        onClose={onClose}
        onEquip={async () => undefined}
        onUnequip={async () => undefined}
        onDiscard={async () => undefined}
        onDismantle={onDismantle}
        onClearError={() => undefined}
        dismantleError={null}
      />
    );

    const modalRoot = container.querySelector(".pixel-modal.max-w-xl");
    const dismantleButton = modalRoot
      ? findButton(modalRoot, "분해")
      : undefined;
    expect(dismantleButton).toBeDefined();

    await act(async () => {
      dismantleButton?.dispatchEvent(
        new MouseEvent("click", { bubbles: true })
      );
    });

    const dismantleDialog = container.querySelector(".pixel-modal.max-w-2xl");
    expect(dismantleDialog).not.toBeNull();

    const confirmButton = dismantleDialog
      ? findButton(dismantleDialog, "분해")
      : undefined;
    expect(confirmButton).toBeDefined();

    await act(async () => {
      confirmButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await Promise.resolve();
    });

    expect(onDismantle).toHaveBeenCalledWith(baseItem.id);
    expect(onClose).toHaveBeenCalled();

    unmount();
  });

  it("분해 모달은 dismantleError 메시지를 표시한다", async () => {
    const { container, unmount } = render(
      <InventoryModal
        item={baseItem}
        slot="weapon"
        isPending={false}
        isSyncing={false}
        error={null}
        onClose={() => undefined}
        onEquip={async () => undefined}
        onUnequip={async () => undefined}
        onDiscard={async () => undefined}
        onDismantle={async () => undefined}
        onClearError={() => undefined}
        dismantleError={new Error("분해 실패")}
      />
    );

    const modalRoot = container.querySelector(".pixel-modal.max-w-xl");
    const dismantleButton = modalRoot
      ? findButton(modalRoot, "분해")
      : undefined;
    expect(dismantleButton).toBeDefined();

    await act(async () => {
      dismantleButton?.dispatchEvent(
        new MouseEvent("click", { bubbles: true })
      );
    });

    const dismantleDialog = container.querySelector(".pixel-modal.max-w-2xl");
    expect(dismantleDialog).not.toBeNull();
    expect(dismantleDialog?.textContent).toContain("분해 실패");

    unmount();
  });
});

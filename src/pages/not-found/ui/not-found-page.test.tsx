import React, { StrictMode, act } from "react";
import { beforeAll, describe, expect, it } from "vitest";
import { createRoot } from "react-dom/client";
import { NotFoundPage } from "./not-found-page";

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

beforeAll(() => {
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
});

describe("NotFoundPage", () => {
  it("홈으로 이동 CTA를 표시한다", () => {
    const { container, unmount } = render(<NotFoundPage />);

    const link = container.querySelector('a[href="/"]');
    expect(link).not.toBeNull();
    expect(container.textContent).toContain("홈으로 이동");

    unmount();
  });
});

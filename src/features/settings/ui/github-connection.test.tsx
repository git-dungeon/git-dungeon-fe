import React, { StrictMode, act } from "react";
import { beforeAll, describe, expect, it } from "vitest";
import { createRoot } from "react-dom/client";
import { GithubConnection } from "./github-connection";

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

describe("GithubConnection", () => {
  it("연결된 상태 정보를 표시한다", () => {
    const { container, unmount } = render(
      <GithubConnection
        connections={{
          github: { connected: true, lastSyncAt: "2025-10-21T01:00:00.000Z" },
        }}
      />
    );

    const textContent = container.textContent ?? "";
    expect(textContent).toContain("GitHub 연동");
    expect(textContent).toContain("연결됨");

    unmount();
  });

  it("미연결 상태 메시지를 안내한다", () => {
    const { container, unmount } = render(
      <GithubConnection connections={{ github: { connected: false } }} />
    );

    const textContent = container.textContent ?? "";
    expect(textContent).toContain("미연결");
    expect(textContent).toContain("계정을 연동하면 커밋 통계가 표시됩니다.");

    unmount();
  });
});

import React, { StrictMode, act } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RankingPage } from "./ranking-page";

const rankingTableSpy = vi.fn();

vi.mock("@/widgets/ranking-table/ui/ranking-table", () => ({
  RankingTable: () => {
    rankingTableSpy();
    return <div data-testid="ranking-table" />;
  },
}));

function render(ui: React.ReactElement) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const queryClient = new QueryClient();

  act(() => {
    root.render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
      </StrictMode>
    );
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

describe("/ranking 화면", () => {
  it("RankingTable을 렌더링한다", () => {
    const { container, unmount } = render(<RankingPage />);

    expect(
      container.querySelector("[data-testid='ranking-table']")
    ).not.toBeNull();
    expect(rankingTableSpy).toHaveBeenCalled();

    unmount();
  });
});

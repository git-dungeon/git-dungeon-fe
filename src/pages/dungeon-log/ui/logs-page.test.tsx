import React, { StrictMode, act } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { createRoot } from "react-dom/client";
import type { DungeonLogTimelineProps } from "@/widgets/dungeon-log-timeline/ui/dungeon-log-timeline";
import { LogsPage } from "./logs-page";

let latestTimelineProps: DungeonLogTimelineProps | null = null;

vi.mock("@/widgets/dungeon-log-timeline/ui/dungeon-log-timeline", () => ({
  DungeonLogTimeline: (props: DungeonLogTimelineProps) => {
    latestTimelineProps = props;
    return <div data-testid="timeline" />;
  },
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

function setInputValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value"
  )?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

beforeAll(() => {
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
});

describe("/logs 화면", () => {
  it("날짜 범위가 변경되면 타임라인에 from/to ISO 값이 전달된다", () => {
    const { container, unmount } = render(<LogsPage />);

    const inputs = container.querySelectorAll(
      'input[type="date"]'
    ) as NodeListOf<HTMLInputElement>;
    expect(inputs.length).toBe(2);

    act(() => {
      setInputValue(inputs[0], "2026-01-01");
    });

    act(() => {
      setInputValue(inputs[1], "2026-01-03");
    });

    const expectedFrom = new Date("2026-01-01T00:00:00.000").toISOString();
    const expectedTo = new Date("2026-01-03T23:59:59.999").toISOString();

    expect(latestTimelineProps?.from).toBe(expectedFrom);
    expect(latestTimelineProps?.to).toBe(expectedTo);

    unmount();
  });
});

import React, { StrictMode, act } from "react";
import { createRoot } from "react-dom/client";
import { beforeAll, describe, expect, it } from "vitest";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/ui/dialog";

function render(ui: React.ReactElement) {
  const host = document.createElement("div");
  document.body.appendChild(host);
  const root = createRoot(host);

  act(() => {
    root.render(<StrictMode>{ui}</StrictMode>);
  });

  return {
    host,
    root,
    unmount: () => {
      act(() => root.unmount());
      host.remove();
    },
  };
}

beforeAll(() => {
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
});

describe("DialogContent", () => {
  it("pixel-app이 나중에 추가되면 Portal 컨테이너를 갱신한다", async () => {
    const { unmount } = render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Portal target</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
        </DialogContent>
      </Dialog>
    );

    expect(document.querySelector(".pixel-app")).toBeNull();
    const titleInBodyBefore =
      document.body.textContent?.includes("Portal target");
    expect(titleInBodyBefore).toBe(true);

    const pixelApp = document.createElement("div");
    pixelApp.className = "pixel-app";
    document.body.appendChild(pixelApp);

    await act(async () => {
      await Promise.resolve();
    });

    expect(pixelApp.textContent?.includes("Portal target")).toBe(true);

    pixelApp.remove();
    unmount();
  });
});

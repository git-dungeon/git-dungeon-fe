import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", () => ({
  createRootRouteWithContext: () => (config: unknown) => config,
  Link: () => null,
  Outlet: () => null,
  useRouterState: () => ({ location: { pathname: "/unknown" } }),
}));

describe("__root notFoundComponent", () => {
  it("전역 notFoundComponent를 설정한다", async () => {
    const { Route } = (await import("@/routes/__root")) as unknown as {
      Route: { notFoundComponent?: unknown };
    };

    expect(Route.notFoundComponent).toBeTruthy();
  });
});

import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (config: unknown) => config,
  redirect: (options: unknown) => ({
    __redirect: true,
    ...(options as Record<string, unknown>),
  }),
}));

describe("/ 라우트", () => {
  it("세션이 없거나 서버 연결 문제가 있어도 /login으로 리다이렉트한다", async () => {
    const redirectIfAuthenticated = vi.fn().mockResolvedValue(undefined);
    const { Route } = (await import("@/routes/index")) as unknown as {
      Route: { beforeLoad: (params: unknown) => Promise<unknown> };
    };

    await expect(
      Route.beforeLoad({
        context: { auth: { redirectIfAuthenticated } },
        location: { pathname: "/", searchStr: "", hash: "" },
      })
    ).rejects.toMatchObject({ __redirect: true, to: "/login" });
  });

  it("세션이 있으면 /dashboard로 리다이렉트한다", async () => {
    const redirectIfAuthenticated = vi.fn().mockImplementation(() => {
      throw { __redirect: true, to: "/dashboard" };
    });
    const { Route } = (await import("@/routes/index")) as unknown as {
      Route: { beforeLoad: (params: unknown) => Promise<unknown> };
    };

    await expect(
      Route.beforeLoad({
        context: { auth: { redirectIfAuthenticated } },
        location: { pathname: "/", searchStr: "", hash: "" },
      })
    ).rejects.toMatchObject({ __redirect: true, to: "/dashboard" });
  });
});

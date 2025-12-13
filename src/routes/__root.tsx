import {
  Link,
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { RouterContext } from "@/shared/lib/router/router-context";
import { cn } from "@/shared/lib/utils";
import { ensureQueryDataSafe } from "@/shared/lib/query/ensure-query-data-safe";
import { catalogQueryOptions } from "@/entities/catalog/model/catalog-query";
import { getLanguagePreference } from "@/shared/lib/preferences/preferences";

const NAVIGATION_LINKS = [
  { to: "/dashboard", label: "대시보드" },
  { to: "/inventory", label: "인벤토리" },
  { to: "/logs", label: "로그" },
  { to: "/settings", label: "설정" },
] as const;

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context }) => {
    await ensureQueryDataSafe(
      context.queryClient,
      catalogQueryOptions(getLanguagePreference())
    );
  },
  component: RootComponent,
});

function RootComponent() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const isLoginScreen = pathname.startsWith("/login");
  const shouldRenderHeader = !isLoginScreen;

  return (
    <div
      className={cn(
        "text-foreground flex min-h-screen flex-col",
        "bg-background"
      )}
    >
      {shouldRenderHeader ? (
        <header className="bg-card border-b">
          <nav className="mx-auto flex w-full max-w-5xl items-center gap-6 px-6 py-4">
            <Link
              to="/dashboard"
              className="text-foreground text-lg font-semibold"
            >
              Git Dungeon
            </Link>
            <div className="flex flex-1 items-center gap-4">
              {NAVIGATION_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-muted-foreground hover:text-primary [&.active]:text-primary text-sm font-medium transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </header>
      ) : null}
      <main
        className={cn(
          "flex w-full flex-1 flex-col",
          "mx-auto max-w-5xl px-6 py-8"
        )}
      >
        <Outlet />
      </main>
      {import.meta.env.DEV ? <TanStackRouterDevtools /> : null}
    </div>
  );
}

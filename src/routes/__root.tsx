import {
  Link,
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useTranslation } from "react-i18next";
import type { RouterContext } from "@/shared/lib/router/router-context";
import { cn } from "@/shared/lib/utils";
import { ensureQueryDataSafe } from "@/shared/lib/query/ensure-query-data-safe";
import { catalogQueryOptions } from "@/entities/catalog/model/catalog-query";
import { getLanguagePreference } from "@/shared/lib/preferences/preferences";
import { NotFoundPage } from "@/pages/not-found/ui/not-found-page";

const NAVIGATION_LINKS = [
  { to: "/dashboard", labelKey: "navigation.dashboard" },
  { to: "/inventory", labelKey: "navigation.inventory" },
  { to: "/logs", labelKey: "navigation.logs" },
  { to: "/settings", labelKey: "navigation.settings" },
] as const;

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context, location }) => {
    if (location.pathname.startsWith("/login")) {
      return;
    }

    await ensureQueryDataSafe(
      context.queryClient,
      catalogQueryOptions(getLanguagePreference())
    );
  },
  notFoundComponent: NotFoundPage,
  component: RootComponent,
});

function RootComponent() {
  const { t } = useTranslation();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const isLoginScreen = pathname.startsWith("/login");
  const shouldRenderHeader = !isLoginScreen;

  return (
    <div className={cn("pixel-app font-pixel-body flex min-h-screen flex-col")}>
      {shouldRenderHeader ? (
        <header className="pixel-header">
          <nav className="pixel-header-inner mx-auto flex w-full items-center gap-6 px-6 py-4">
            <Link to="/dashboard" className="pixel-brand">
              {t("common.appName")}
            </Link>
            <div className="flex flex-1 items-center justify-center gap-6 sm:gap-10">
              {NAVIGATION_LINKS.map((link) => (
                <Link key={link.to} to={link.to} className="pixel-nav-link">
                  {t(link.labelKey)}
                </Link>
              ))}
            </div>
          </nav>
        </header>
      ) : null}
      <main
        className={cn(
          "flex w-full flex-1 flex-col",
          isLoginScreen ? "px-6 py-10" : "pixel-main"
        )}
      >
        {isLoginScreen ? (
          <Outlet />
        ) : (
          <div className="pixel-frame">
            <Outlet />
          </div>
        )}
      </main>
      {import.meta.env.DEV ? <TanStackRouterDevtools /> : null}
    </div>
  );
}

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
              {t("common.appName")}
            </Link>
            <div className="flex flex-1 items-center gap-4">
              {NAVIGATION_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-muted-foreground hover:text-primary [&.active]:text-primary text-sm font-medium transition"
                >
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
          "mx-auto max-w-5xl px-6 py-8"
        )}
      >
        <Outlet />
      </main>
      {import.meta.env.DEV ? <TanStackRouterDevtools /> : null}
    </div>
  );
}

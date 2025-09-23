import {
  Link,
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { RouterContext } from "@/shared/lib/router/router-context";

const NAVIGATION_LINKS = [
  { to: "/dashboard", label: "대시보드" },
  { to: "/inventory", label: "인벤토리" },
  { to: "/logs", label: "로그" },
  { to: "/settings", label: "설정" },
] as const;

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  const routerState = useRouterState();
  const isLoginScreen = routerState.location.pathname.startsWith("/login");

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      {isLoginScreen ? null : (
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
      )}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-8">
        <Outlet />
      </main>
      {import.meta.env.DEV ? <TanStackRouterDevtools /> : null}
    </div>
  );
}

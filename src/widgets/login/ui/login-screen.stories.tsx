import type { Decorator, Meta, StoryObj } from "@storybook/react";
import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRouteWithContext,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { LoginScreen } from "@/widgets/login/ui/login-screen";
import type { RouterContext } from "@/shared/lib/router/router-context";
import { createAuthService } from "@/entities/auth/lib/auth-service";

function LoginStoryRouter({ Story }: { Story: () => JSX.Element }) {
  const queryClient = useQueryClient();
  const router = useMemo(() => {
    const rootRoute = createRootRouteWithContext<RouterContext>()({
      component: () => <Outlet />,
    });

    const loginRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/login",
      component: Story,
    });

    const routeTree = rootRoute.addChildren([loginRoute]);

    return createRouter({
      routeTree,
      context: {
        queryClient,
        auth: createAuthService(queryClient),
      },
      history: createMemoryHistory({
        initialEntries: ["/login"],
      }),
    });
  }, [Story, queryClient]);

  return <RouterProvider router={router} />;
}

const withRouter: Decorator = (Story) => <LoginStoryRouter Story={Story} />;

const meta: Meta<typeof LoginScreen> = {
  title: "widgets/LoginScreen",
  component: LoginScreen,
  decorators: [withRouter],
};

export default meta;

type Story = StoryObj<typeof LoginScreen>;

export const Default: Story = {
  args: {
    safeRedirect: "/",
  },
};

export const ErrorState: Story = {
  args: {
    safeRedirect: "/",
    authErrorCode: "AUTH_FORBIDDEN",
  },
};

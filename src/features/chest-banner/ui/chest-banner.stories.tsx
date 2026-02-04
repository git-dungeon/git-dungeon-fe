import type { Decorator, Meta, StoryObj } from "@storybook/react";
import { useMemo, type ReactElement } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRouteWithContext,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ChestBanner } from "@/features/chest-banner/ui/chest-banner";
import type { RouterContext } from "@/shared/lib/router/router-context";
import { createAuthService } from "@/entities/auth/lib/auth-service";

function ChestBannerStoryRouter({ Story }: { Story: () => ReactElement }) {
  const queryClient = useQueryClient();
  const router = useMemo(() => {
    const rootRoute = createRootRouteWithContext<RouterContext>()({
      component: () => <Outlet />,
    });

    const chestRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/chest",
      component: Story,
    });

    const routeTree = rootRoute.addChildren([chestRoute]);

    return createRouter({
      routeTree,
      context: {
        queryClient,
        auth: createAuthService(queryClient),
      },
      history: createMemoryHistory({
        initialEntries: ["/chest"],
      }),
    });
  }, [Story, queryClient]);

  return <RouterProvider router={router} />;
}

const withRouter: Decorator = (Story) => (
  <ChestBannerStoryRouter Story={Story} />
);

const meta: Meta<typeof ChestBanner> = {
  title: "features/ChestBanner",
  component: ChestBanner,
  decorators: [withRouter],
  parameters: {
    pixel: { background: true },
  },
};

export default meta;

type Story = StoryObj<typeof ChestBanner>;

export const Default: Story = {
  args: {
    count: 1,
  },
};

export const Many: Story = {
  args: {
    count: 5,
  },
};

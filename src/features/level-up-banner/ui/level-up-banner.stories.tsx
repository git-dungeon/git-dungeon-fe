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
import { LevelUpBanner } from "@/features/level-up-banner/ui/level-up-banner";
import type { RouterContext } from "@/shared/lib/router/router-context";
import { createAuthService } from "@/entities/auth/lib/auth-service";

function LevelUpBannerStoryRouter({ Story }: { Story: () => ReactElement }) {
  const queryClient = useQueryClient();
  const router = useMemo(() => {
    const rootRoute = createRootRouteWithContext<RouterContext>()({
      component: () => <Outlet />,
    });

    const levelUpRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/level-up",
      component: Story,
    });

    const routeTree = rootRoute.addChildren([levelUpRoute]);

    return createRouter({
      routeTree,
      context: {
        queryClient,
        auth: createAuthService(queryClient),
      },
      history: createMemoryHistory({
        initialEntries: ["/level-up"],
      }),
    });
  }, [Story, queryClient]);

  return <RouterProvider router={router} />;
}

const withRouter: Decorator = (Story) => (
  <LevelUpBannerStoryRouter Story={Story} />
);

const meta: Meta<typeof LevelUpBanner> = {
  title: "features/LevelUpBanner",
  component: LevelUpBanner,
  decorators: [withRouter],
};

export default meta;

type Story = StoryObj<typeof LevelUpBanner>;

export const Default: Story = {
  args: {
    points: 2,
  },
};

export const ManyPoints: Story = {
  args: {
    points: 5,
  },
};

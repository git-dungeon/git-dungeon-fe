import { redirect, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context, location }) => {
    await context.auth.redirectIfAuthenticated({
      location,
      redirectTo: "/dashboard",
    });

    throw redirect({ to: "/login" });
  },
  component: IndexRoute,
});

function IndexRoute() {
  return null;
}

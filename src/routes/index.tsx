import { redirect, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context }) => {
    const session = await context.auth.ensureSession();

    if (session) {
      throw redirect({ to: "/dashboard" });
    }

    throw redirect({ to: "/login" });
  },
  component: IndexRoute,
});

function IndexRoute() {
  return null;
}

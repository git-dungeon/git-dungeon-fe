import { redirect, createFileRoute } from "@tanstack/react-router";
import { authSessionQueryOptions } from "@/entities/auth/model/auth-session-query";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData(
      authSessionQueryOptions
    );

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

import { redirect, type ParsedLocation } from "@tanstack/react-router";
import { authSessionQueryOptions } from "@/entities/auth/model/auth-session-query";
import type { RouterContext } from "@/shared/lib/router/router-context";

export async function requireAuthSession(params: {
  context: RouterContext;
  location: ParsedLocation;
}) {
  const { context, location } = params;
  const session = await context.queryClient.ensureQueryData(
    authSessionQueryOptions
  );

  if (!session) {
    const redirectPath = `${location.pathname}${location.search}${location.hash}`;
    throw redirect({
      to: "/login",
      search: {
        redirect: redirectPath === "" ? "/" : redirectPath,
      },
    });
  }

  return session;
}

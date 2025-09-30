import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { httpRequest } from "@/shared/api/http-client";
import { AUTH_ENDPOINTS } from "@/shared/config/env";

async function logoutRequest() {
  await httpRequest<{ success: boolean }>(AUTH_ENDPOINTS.logout, {
    method: "POST",
    parseAs: "json",
  });
}

export function useLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: async () => {
      await router.options.context.auth.invalidateSession();
      await router.navigate({ to: "/login" });
    },
  });
}

import type { QueryClient } from "@tanstack/react-query";
import type { AuthService } from "@/entities/auth/lib/auth-service";

export interface RouterContext {
  queryClient: QueryClient;
  auth: AuthService;
}

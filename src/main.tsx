import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import { queryClient } from "@/shared/lib/query/query-client";
import type { RouterContext } from "@/shared/lib/router/router-context";
import { createAuthService } from "@/entities/auth/lib/auth-service";
import { IS_MSW_ENABLED } from "@/shared/config/env";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";

const authService = createAuthService(queryClient);

const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: authService,
  } satisfies RouterContext,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

async function enableMocking() {
  if (!IS_MSW_ENABLED) {
    return;
  }

  const { startMockServiceWorker } = await import("@/mocks/browser");
  await startMockServiceWorker();
}

async function bootstrap() {
  if (typeof window === "undefined") {
    return;
  }

  if (IS_MSW_ENABLED) {
    await enableMocking();
  }

  const rootElement = document.querySelector("#root");
  if (!rootElement) {
    throw new Error("#root element not found");
  }

  if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
}

void bootstrap();

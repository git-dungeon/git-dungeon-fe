import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { routeTree } from "./routeTree.gen";
import {
  queryClient,
  queryClientPersistOptions,
} from "@/shared/lib/query/query-client";
import type { RouterContext } from "@/shared/lib/router/router-context";

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  } satisfies RouterContext,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  if (queryClientPersistOptions) {
    return (
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={queryClientPersistOptions}
      >
        <RouterProvider router={router} />
      </PersistQueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

const rootElement = document.querySelector("#root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

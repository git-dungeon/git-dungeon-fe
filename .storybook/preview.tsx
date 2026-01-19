import type { Preview } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { startMockServiceWorker } from "../src/mocks/browser";
import { Toaster } from "../src/shared/ui/sonner";
import "../src/shared/i18n/i18n";
import "../src/index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

if (typeof window !== "undefined") {
  void startMockServiceWorker();
}

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: { expanded: true },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div className="pixel-app font-pixel-body min-h-screen p-6">
          <Story />
        </div>
        <Toaster />
      </QueryClientProvider>
    ),
  ],
};

export default preview;

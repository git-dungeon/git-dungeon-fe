import type { Preview } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { startMockServiceWorker } from "../src/mocks/browser";
import { Toaster } from "../src/shared/ui/sonner";
import type { CSSProperties } from "react";
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

let mswReady: Promise<void> | null = null;

async function ensureMswReady() {
  if (typeof window === "undefined") {
    return;
  }

  if (!mswReady) {
    mswReady = startMockServiceWorker().catch((error) => {
      mswReady = null;
      if (import.meta.env?.DEV) {
        console.warn("[storybook] MSW 시작 실패", error);
      }
    });
  }

  await mswReady;
}

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: { expanded: true },
    pixel: {
      background: false,
    },
  },
  loaders: [
    async () => {
      await ensureMswReady();
      return {};
    },
  ],
  decorators: [
    (Story, context) => {
      const backgroundEnabled =
        context.parameters?.pixel?.background === true;

      return (
        <QueryClientProvider client={queryClient}>
          <div
            className="pixel-app font-pixel-body min-h-screen p-6"
            style={
              backgroundEnabled
                ? undefined
                : ({ ["--pixel-bg-opacity" as any]: "0" } as CSSProperties)
            }
          >
            <Story />
          </div>
          <Toaster />
        </QueryClientProvider>
      );
    },
  ],
};

export default preview;

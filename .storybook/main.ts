import path from "path";
import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: [
    // Pixel UI + product-facing stories only.
    // Base(shadcn) UI stories are intentionally excluded to reduce confusion.
    "../src/shared/ui/pixel-*.stories.@(ts|tsx)",
    "../src/shared/ui/sonner.stories.@(ts|tsx)",
    "../src/widgets/**/*.stories.@(ts|tsx)",
    "../src/features/**/*.stories.@(ts|tsx)",
  ],
  addons: ["@storybook/addon-essentials"],
  framework: "@storybook/react-vite",
  staticDirs: ["../public"],
  async viteFinal(config) {
    const { default: tailwindcss } = await import("@tailwindcss/vite");

    return mergeConfig(config, {
      plugins: [tailwindcss()],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "../src"),
        },
      },
    });
  },
};

export default config;

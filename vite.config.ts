import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type PluginOption } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

const isTest = process.env.VITEST === "true";

const plugins: PluginOption[] = [react(), tailwindcss()];

if (!isTest) {
  plugins.unshift(
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    })
  );
}

// https://vite.dev/config/
export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/mocks/tests/setup.ts"],
    globals: true,
  },
});

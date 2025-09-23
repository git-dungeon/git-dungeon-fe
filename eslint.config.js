import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";
import unicorn from "eslint-plugin-unicorn";
import eslintConfigPrettier from "eslint-config-prettier";
import unusedImports from "eslint-plugin-unused-imports";

export default tseslint.config([
  globalIgnores(["dist", "src/routeTree.gen.ts", "public/mockServiceWorker.js"]),
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      "unicorn": unicorn,
      "unused-imports": unusedImports,
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "unicorn/filename-case": "off",
      "unicorn/prevent-abbreviations": "off",
      "unused-imports/no-unused-imports": "error",
    },
  },

  eslintConfigPrettier,
]);

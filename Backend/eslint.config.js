// Backend/eslint.config.js
// ESLint v9 flat config for the Dokkan Backend (ESM, TypeScript)
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // Base recommended rules
  js.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  // Project-wide settings
  {
    files: ["src/**/*.{ts,js}", "tests/**/*.{ts,js}"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // ── Security ──────────────────────────────────────────────────────────
      "no-eval":                       "error",
      "no-implied-eval":               "error",

      // ── Code quality ──────────────────────────────────────────────────────
      "no-console":                    "warn",
      "no-debugger":                   "error",
      "no-duplicate-imports":          "error",
      "no-unused-vars":                "off",   // handled by @typescript-eslint
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
      "@typescript-eslint/no-explicit-any":    "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-floating-promises": "error",

      // ── Style (auto-fixable) ──────────────────────────────────────────────
      "prefer-const":                  "error",
      "eqeqeq":                        ["error", "always"],
    },
  },

  // Ignore build output and generated files
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "src/generated/**",
      "generated/**",
      "prisma/migrations/**",
    ],
  }
);

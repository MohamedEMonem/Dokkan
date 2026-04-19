// Backend/vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Test file patterns
    include: ["tests/**/*.{test,spec}.{ts,js}"],
    exclude: ["tests/integration/**"],

    // Reporter settings
    reporters: ["default", "json"],
    outputFile: {
      json: "../reports/vitest-raw.json",
    },

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "lcov"],
      reportsDirectory: "../reports/coverage",
      include: ["src/**/*.{ts,js}"],
      exclude: [
        "src/**/*.d.ts",
        "src/generated/**",
        "src/server.ts",          // entry point – excluded from coverage requirement
      ],
      // Coverage thresholds are enforced by ci/qc/run_unit.sh, not here,
      // so that coverage warnings never block the test run itself.
      // thresholds: { lines: 60, functions: 60, branches: 50, statements: 60 }
    },

    // Environment
    environment: "node",

    // Timeout per test
    testTimeout: 10_000,

    // Global setup / teardown
    globalSetup: [],
  },
});

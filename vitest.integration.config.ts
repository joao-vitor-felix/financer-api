import path from "node:path";

import { config } from "dotenv";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    silent: true,
    passWithNoTests: true,
    env: {
      ...config({ path: ".env.test" }).parsed
    },
    include: ["**/*.integration.test.ts", "**/*.spec.ts"],
    globalSetup: ["src/tests/global-setup.ts"],
    setupFiles: ["src/tests/setup.ts"]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }
});

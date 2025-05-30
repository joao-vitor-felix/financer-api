import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    silent: true,
    passWithNoTests: true,
    include: ["**/*.test.ts"]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }
});

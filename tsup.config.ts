import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/main.ts"],
  sourcemap: true,
  minify: true,
  clean: true,
  target: "es2022",
  format: ["esm"]
});

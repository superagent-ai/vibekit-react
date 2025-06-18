import { defineConfig } from "tsup";
import path from "path";

export default defineConfig({
  entry: ["src/index.ts", "src/style.css"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  publicDir: "src/assets",
  esbuildOptions(options) {
    options.alias = {
      "@": path.resolve(process.cwd(), "src")
    };
    options.loader = {
      '.svg': 'dataurl',
      '.png': 'dataurl',
      '.jpg': 'dataurl',
      '.jpeg': 'dataurl'
    };
  }
}); 
import { defineConfig } from "tsup";
import path from "path";

export default defineConfig([
  // Original builds (ESM/CJS for npm)
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    external: ["react", "react-dom"],
    publicDir: "src/assets",
    injectStyle: true, // Automatically inject CSS into JS bundles
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
  },
]); 
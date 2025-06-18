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
  // UMD build for script tag
  {
    entry: ["src/script-tag.tsx"],
    format: ["iife"],
    outDir: "dist",
    outExtension: () => ({
      js: '.umd.js'
    }),
    globalName: "VibeKit",
    sourcemap: true,
    minify: true,
    platform: "browser",
    external: [],
    noExternal: ["react", "react-dom"],
    injectStyle: true, // Inline CSS into the JS bundle
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
  }
]); 
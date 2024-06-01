import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/main.js",
      name: "edge-parser",
      fileName: "main",
    },
  },
});

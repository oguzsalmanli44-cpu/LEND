import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// Single-file build so the app can be shared as one self-contained HTML page.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
});

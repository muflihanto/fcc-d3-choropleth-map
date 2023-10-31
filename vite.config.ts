import { defineConfig } from "vite";
import UnoCSS from "unocss/vite";
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/fcc-d3-choropleth-map",
  plugins: [UnoCSS(), preact()],
});

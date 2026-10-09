import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const port = Number(process.env.PORT || process.env.PASEO_PORT || 5173);
const host = process.env.HOST || "127.0.0.1";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { host, port, strictPort: true, allowedHosts: true },
  preview: { host, port, strictPort: true, allowedHosts: true },
});

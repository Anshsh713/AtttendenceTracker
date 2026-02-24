import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/AtttendenceTracker/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Attendance Tracker",
        short_name: "Attendance",
        description: "Track your class attendance easily",
        theme_color: "#222831",
        background_color: "#222831",
        display: "standalone",
        orientation: "portrait",
        start_url: "/AtttendenceTracker/",
        icons: [
          {
            src: "/AtttendenceTracker/logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/AtttendenceTracker/logo.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});

import { defineConfig } from "vite";
import { resolve } from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "prompt",
      includeAssets: ["favicon.png", "images/logo.png"],
      manifest: {
        name: "Story App - Dicoding Submission",
        short_name: "Story App",
        description:
          "Aplikasi berbagi cerita sebagai submission Proyek Akhir Dicoding.",
        theme_color: "#367EAA",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/index.html",
        icons: [
          {
            src: "/images/logo.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/images/logo.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,jpg,svg}"],
        importScripts: ["custom-sw.js"],
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.href.startsWith("https://story-api.dicoding.dev"),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "story-api-cache",
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: ({ url }) =>
              url.href.startsWith("https://server.arcgisonline.com"),
            handler: "CacheFirst",
            options: {
              cacheName: "map-tiles-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
});

// nuxt.config.ts
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  devtools: { enabled: true },

  css: [
    "~/assets/css/main.css",
    "~/assets/css/scrollbar.css",
  ],

  runtimeConfig: {
    public: {
      api: "/api", // ตั้งไว้เป็น default route
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  nitro: {
    devProxy: {
      "/api": {
        target: "http://localhost:80", // URL backend
        changeOrigin: true,
        prependPath: true,
      },
    },
  },
});
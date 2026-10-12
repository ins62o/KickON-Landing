import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        privacy: resolve(import.meta.dirname, "privacy/index.html"),
        terms: resolve(import.meta.dirname, "terms/index.html"),
        accountDeletion: resolve(import.meta.dirname, "account-deletion/index.html"),
      },
    },
  },
});

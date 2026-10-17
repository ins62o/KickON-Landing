import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import type { Connect } from "vite";
import { canonicalLandingPath } from "./src/landing-routes.ts";
import { resolve } from "node:path";

const cleanRouteRequest: Connect.NextHandleFunction = (request, _response, next) => {
  if (request.method === 'GET' || request.method === 'HEAD') {
    const url = new URL(request.url ?? '/', 'http://localhost');
    const canonical = canonicalLandingPath(url.pathname);
    if (canonical && canonical !== '/') request.url = canonical + '/index.html' + url.search;
  }
  next();
};

export default defineConfig({
  plugins: [{
    name: 'kickon-clean-routes',
    configureServer(server) { server.middlewares.use(cleanRouteRequest); },
    configurePreviewServer(server) { server.middlewares.use(cleanRouteRequest); },
  }, react()],
  build: {
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        features: resolve(import.meta.dirname, "features/index.html"),
        matchday: resolve(import.meta.dirname, "matchday/index.html"),
        policies: resolve(import.meta.dirname, "policies/index.html"),
        privacy: resolve(import.meta.dirname, "privacy/index.html"),
        terms: resolve(import.meta.dirname, "terms/index.html"),
        accountDeletion: resolve(import.meta.dirname, "account-deletion/index.html"),
      },
    },
  },
});

import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import { getSiteRoute } from "./site-routes.tsx";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Missing #root element");
}

const RootPage = getSiteRoute(window.location.pathname).component;
const app = (
  <StrictMode>
    <RootPage />
  </StrictMode>
);

if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}

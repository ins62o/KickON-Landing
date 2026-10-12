import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { getLegalPage } from "./legal-routes";
import "./index.css";

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root element");
const Page = getLegalPage(window.location.pathname);

createRoot(root).render(<StrictMode><Page /></StrictMode>);

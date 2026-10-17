import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import LandingApp from "./landing/LandingApp";
import "../styles.css";
import "../product.css";

createRoot(document.getElementById("root")!).render(<StrictMode><LandingApp /></StrictMode>);

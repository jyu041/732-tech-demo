// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/components.css";
import "./styles/pages.css";
import "./styles/modals.css";
import "./assets/themes/instagram.css"; // Default theme

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

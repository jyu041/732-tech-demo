// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/components.css";
import "./styles/pages.css";
import "./styles/modals.css";
import "./styles/chat.css";
import "./assets/themes/instagram.css"; // Default theme
import "react-image-crop/dist/ReactCrop.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

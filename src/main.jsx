import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./Componentes/Utils/I18next.js";
import App from "./App.jsx";
import "./RoyaLToast.css";
import { inicializarLocalStorage } from "./Componentes/Utils/inicializarLocalStorage.js"; // <- import utils

// Inicializamos localStorage antes de renderizar la app
inicializarLocalStorage();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#0c0c0c",
          color: "#d4af37",
          border: "1px solid #d4af37",
          fontFamily: "Montserrat, sans-serif",
          fontSize: "0.95rem",
          padding: "14px 18px",
        },
        success: {
          iconTheme: {
            primary: "#d4af37",
            secondary: "#0c0c0c",
          },
        },
        error: {
          iconTheme: {
            primary: "#ff4444",
            secondary: "#0c0c0c",
          },
        },
      }}
    />
    <App />
  </StrictMode>
);

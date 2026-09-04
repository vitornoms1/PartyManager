import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { aplicarTema, getTemaSalvo } from "./theme";
import "./index.css";
import { Toaster } from "sonner";

aplicarTema(getTemaSalvo());

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Toaster
      position="top-right"
      richColors
      closeButton
    />
    <App />
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { aplicarTema, getTemaSalvo } from "./theme";
import "./index.css";

aplicarTema(getTemaSalvo());

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

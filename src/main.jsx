import React from "react";
import ReactDOM from "react-dom/client";
import Registro from "./Registro.jsx"; // 👈 Importamos el componente

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Registro /> {/* 👈 Lo usamos aquí */}
  </React.StrictMode>
);
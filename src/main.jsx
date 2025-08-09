import React from "react";
import ReactDOM from "react-dom/client";
import Registro from "./Registro.jsx"; // 👈 Importamos el componente
import Clases from "./clases.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Registro /> 
    <Clases />
  </React.StrictMode>
);
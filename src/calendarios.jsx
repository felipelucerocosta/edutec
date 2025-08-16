import React from "react";
import ReactDOM from "react-dom/client";
import Calendario from "./components/calendario.jsx"; // 👈 Importamos el componente


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Calendario /> 
    
  </React.StrictMode>
);
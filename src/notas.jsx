import React from "react";
import ReactDOM from "react-dom/client";
import Notas from "./components/notas.jsx"; // 👈 Importamos el componente


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Notas /> 
    
  </React.StrictMode>
);
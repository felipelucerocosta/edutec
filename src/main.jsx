import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Registro from "./components/Registro.jsx";
import Calendario from "./components/calendario.jsx";
import Clases from "./components/clases.jsx";
import Tablon from "./components/tablon.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Clases />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/clases" element={<Clases />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/tablon" element={<Tablon />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
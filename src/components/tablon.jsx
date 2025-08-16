import React, { useState, useEffect } from "react";
import "../styles/tablon.css";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "boxicons/css/boxicons.min.css";

export default function Tablon() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);


// Añade un estado para controlar la barra de navegación
const [navActive, setNavActive] = useState(false);

// Funciones para abrir y cerrar la barra de navegación
const handleAbrirNav = () => {
  setNavActive(true);
};

const handleCerrarNav = () => {
  setNavActive(false);
};
  // Cargar mensajes desde localStorage
  const cargarMensajes = () => {
    const mensajesGuardados = localStorage.getItem("mensajes");
    if (mensajesGuardados) {
      setMensajes(JSON.parse(mensajesGuardados));
    } else {
      setMensajes([]);
    }
  };

  // Guardar mensajes en localStorage
  const guardarMensajes = (nuevosMensajes) => {
    localStorage.setItem("mensajes", JSON.stringify(nuevosMensajes));
  };

  const enviarMensaje = () => {
    if (mensaje.trim() === "") return;

    const nuevosMensajes = [...mensajes, mensaje.trim()];
    setMensajes(nuevosMensajes);
    guardarMensajes(nuevosMensajes);
    setMensaje("");
  };

  useEffect(() => {
    cargarMensajes();
  }, []);


  return (
    <div>
        <header>
        <div className="logo">
        <h1>EDUTECHUB</h1>
        </div>
        <button id="abrir-nav" onClick={handleAbrirNav}>
          <i className="fa-solid fa-bars"></i>
        </button>
        <nav className={navActive ? "nav-bar active" : "nav-bar"}>
          <ul className="nav-list">
            <button id="cerrar-nav" onClick={handleCerrarNav} >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <li><Link to="/clases"><i className='bx bx-menu'></i>Menu</Link></li>
            <li><Link to="/calendario"><i className="bx bx-calendar"></i>Calendario</Link></li>
            <li><Link to="/tablon"><i className="bx bx-table"></i>tablon</Link></li>
          </ul>
        </nav>
      </header>

      <div className="container">
        <div className="main-content">
          <h2>TABLÓN</h2>
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribe tu mensaje aquí..."
            rows="6"
            style={{ width: "100%", resize: "vertical" }}
          ></textarea>
          <button
            onClick={enviarMensaje}
            style={{ marginTop: "10px" }}
          >
            Enviar
          </button>

          <div
            id="mensajes"
            style={{
              marginTop: "20px",
              border: "1px solid #ccc",
              padding: "10px",
              background: "#fafafa",
              minHeight: "100px",
            }}
          >
            {mensajes.length === 0 ? (
              <p>No hay mensajes</p>
            ) : (
              mensajes.map((m, i) => <div key={i}>{m}</div>)
            )}
          </div>
        </div>
        <div className="admin-title">[ADMINISTRACIÓN]</div>
      </div>

      <footer>
        <p>Derechos de autor © 2025 EdutecHub</p>
      </footer>
    </div>
  );
}

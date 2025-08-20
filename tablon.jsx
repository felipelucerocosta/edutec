import React, { useState, useEffect } from "react";
import "../styles/tablon.css";
import "boxicons/css/boxicons.min.css";

export default function Tablon() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const cargarMensajes = () => {
    // Aquí en producción deberías hacer un fetch real a tu backend
    fetch("/api/obtener_mensajes") 
      .then((res) => res.json())
      .then((data) => setMensajes(data))
      .catch(() => setMensajes([]));
  };

  const enviarMensaje = () => {
    if (mensaje.trim() === "") return;
    fetch("/api/guardar_mensajes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensaje }),
    })
      .then(() => {
        setMensaje("");
        cargarMensajes();
      })
      .catch(console.error);
  };

  useEffect(() => {
    cargarMensajes();
    const intervalo = setInterval(cargarMensajes, 5000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div>
      <header>
        <div className="logo">
          <img src="../img/logo1.jpg" alt="Logo de la compañía" />
          <a href="/" className="nombre-logo">EDUTECHUB</a>
        </div>

        {/* Menú normal */}
        <nav>
          <a href="/index.html">
            Registrarse <i className="bx bxs-user"></i>
          </a>
          <a href="/calendario.html">
            Calendario <i className="bx bx-calendar"></i>
          </a>
          <a href="/notas.html">
            Notas <i className="bx bxs-spreadsheet"></i>
          </a>
        </nav>

        {/* Botón menú móvil */}
        <button className="menu-toggle" onClick={toggleMenu}>☰</button>

        {/* Menú desplegable */}
        <div className={`dropdown ${menuAbierto ? "show" : ""}`} id="menu">
          <a href="/registro">
            <i className="bx bxs-user"></i> Registrarse
          </a>
          <a href="/calendario">
            <i className="bx bx-calendar"></i> Calendario
          </a>
          <a href="/notas">
            <i className="bx bxs-spreadsheet"></i> Notas
          </a>
        </div>
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

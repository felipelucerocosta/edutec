import React, { useState, useEffect } from "react";
import "../styles/notas.css";
import "boxicons/css/boxicons.min.css";

export default function Notas() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".menu-toggle") && !e.target.closest("#menu")) {
        setMenuAbierto(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
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
          <a href="/registro">
            Registrarse <i className="bx bxs-user"></i>
          </a>
          <a href="/calendario">
            Calendario <i className="bx bx-calendar"></i>
          </a>
          <a href="/tablon">
            Tablón <i className="bx bx-table"></i>
          </a>
          <a href="/notas">
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
          <a href="/tablon">
            <i className="bx bx-table"></i> Tablón
          </a>
          <a href="/notas">
            <i className="bx bxs-spreadsheet"></i> Notas
          </a>
        </div>
      </header>

      <main>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Materia</th>
              <th>Nota</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Juan Pérez</td>
              <td>Matemática</td>
              <td>8</td>
            </tr>
            <tr>
              <td>María López</td>
              <td>Lengua</td>
              <td>9</td>
            </tr>
            <tr>
              <td>Pedro Gómez</td>
              <td>Historia</td>
              <td>7</td>
            </tr>
          </tbody>
        </table>
      </main>

      <footer>
        <p>&copy; 2025 Escuela Ejemplo</p>
      </footer>
    </div>
  );
}

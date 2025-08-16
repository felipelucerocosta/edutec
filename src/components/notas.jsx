import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/notas.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
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

   // Nav mobile
  const handleAbrirNav = () => setNavActive(true);
  const handleCerrarNav = () => setNavActive(false);

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

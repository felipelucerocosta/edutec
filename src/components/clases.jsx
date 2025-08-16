

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/clases.css";
import "boxicons/css/boxicons.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Clases() {
  const [navActive, setNavActive] = useState(false);
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [mostrarUnirse, setMostrarUnirse] = useState(false);
  const [clases, setClases] = useState([]);

  useEffect(() => {
    const clasesGuardadas = JSON.parse(localStorage.getItem("clases")) || [];
    setClases(clasesGuardadas);
    setMostrarCrear(false);
    setMostrarUnirse(false);
  }, []);

  const handleMostrarCrear = () => {
    setMostrarCrear(true);
    setMostrarUnirse(false);
  };

  const handleMostrarUnirse = () => {
    setMostrarCrear(false);
    setMostrarUnirse(true);
  };

  const handleCrearClase = (e) => {
    e.preventDefault();
    const nuevaClase = {
      materia: e.target.materia.value,
      nombre: e.target.nombre.value,
      seccion: e.target.seccion.value,
      aula: e.target.aula.value,
      creador: e.target.creador.value,
      codigo: Math.random().toString(36).substring(2, 8),
    };
    const nuevasClases = [...clases, nuevaClase];
    setClases(nuevasClases);
    localStorage.setItem("clases", JSON.stringify(nuevasClases));
    e.target.reset();
    setMostrarCrear(false);
  };

  const handleUnirseClase = (e) => {
    e.preventDefault();
    const materia = e.target.materia.value;
    const codigo = e.target.codigo.value;
    const claseEncontrada = clases.find(
      (clase) => clase.materia === materia && clase.codigo === codigo
    );
    if (claseEncontrada) {
      alert(`Te has unido a la clase: ${claseEncontrada.nombre}`);
    } else {
      alert("Clase no encontrada.");
    }
    e.target.reset();
    setMostrarUnirse(false);
  };

  // Nav mobile
  const handleAbrirNav = () => setNavActive(true);
  const handleCerrarNav = () => setNavActive(false);

  return (
    <>
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
        <img src="../public/img/logo1.jpg" alt="" className="illustration" />
        <div className="buttons">
          <button id="btnCrearClase" onClick={handleMostrarCrear}>Crear clase</button>
          <button id="btnUnirseClase" onClick={handleMostrarUnirse}>Unirse a clase</button>
        </div>
      </div>
      {/* Formulario para crear clase */}
      {mostrarCrear && (
        <div id="crearClaseForm">
          <form id="formCrearClase" onSubmit={handleCrearClase}>
            <input type="text" name="materia" placeholder="Materia" required />
            <input type="text" name="nombre" placeholder="Nombre de la clase" required />
            <input type="text" name="seccion" placeholder="Sección" required />
            <input type="text" name="aula" placeholder="Aula" required />
            <input type="text" name="creador" placeholder="Profesor" required />
            <button type="submit">Crear clase</button>
          </form>
        </div>
      )}
      {/* Formulario para unirse a clase */}
      {mostrarUnirse && (
        <div id="unirseClaseForm">
          <form id="formUnirseClase" onSubmit={handleUnirseClase}>
            <input type="text" name="materia" placeholder="Materia" required />
            <input type="text" name="codigo" placeholder="Código de clase" required />
            <button type="submit">Unirse a clase</button>
          </form>
        </div>
      )}
      {/* Contenedor de tarjetas */}
      <div id="coursesList">
        {clases.map((clase, index) => (
          <div key={index} className="card">
            <h3>{clase.nombre}</h3>
            <p><strong>Materia:</strong> {clase.materia}</p>
            <p><strong>Sección:</strong> {clase.seccion}</p>
            <p><strong>Aula:</strong> {clase.aula}</p>
            <p><strong>Profesor:</strong> {clase.creador}</p>
            <p><strong>Código:</strong> {clase.codigo}</p>
          </div>
        ))}
      </div>
      <footer>
        <p>© Derechos de autor © 2025 EdutechHub.</p>
      </footer>
    </>
  );
}

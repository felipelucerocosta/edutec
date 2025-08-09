import React, { useState } from "react";
import "./clases.css"; // Tu CSS global

export default function Clases() {
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [mostrarUnirse, setMostrarUnirse] = useState(false);

  const handleMostrarCrear = () => {
    setMostrarCrear(true);
    setMostrarUnirse(false);
  };

  const handleMostrarUnirse = () => {
    setMostrarCrear(false);
    setMostrarUnirse(true);
  };

  return (
    <>
      <header>
        <div className="logo">
          <img src="/img/logo1.jpg" alt="Logo de la compañía" />
          <h1 className="nombre-logo">EDUTECHUB</h1>
        </div>
      </header>

      <main>
        <div className="container">
          <img src="/img/logo1.jpg" alt="Logo" className="illustration" />
          <div className="botonsito">
            <button
              id="btnCrearClase"
              className="btn btn-outline"
              onClick={handleMostrarCrear}
            >
              Crear clase
            </button>
            <button
              id="btnUnirseClase"
              className="btn btn-primary"
              onClick={handleMostrarUnirse}
            >
              Unirse a clase
            </button>
          </div>
        </div>

        {/* Formulario para crear clase */}
        {mostrarCrear && (
          <div id="crearClaseForm">
            <form id="formCrearClase">
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
            <form id="formUnirseClase">
              <input type="text" name="materia" placeholder="Materia" required />
              <input type="text" name="codigo" placeholder="Código de clase" required />
              <button type="submit">Unirse a clase</button>
            </form>
          </div>
        )}

        {/* Contenedor de tarjetas */}
        <div id="coursesList"></div>
      </main>

      {/* Imagen extra abajo, ejemplo banner o ilustración */}
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <img 
          src="/img/banner.jpg" 
          alt="Banner ilustrativo" 
          style={{ maxWidth: "90%", height: "auto", borderRadius: "8px" }} 
        />
      </div>

      <footer>
        <p>© Derechos de autor © 2025 EdutechHub.</p>
      </footer>
    </>
  );
}

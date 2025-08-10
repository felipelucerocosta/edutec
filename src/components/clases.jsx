import React, { useState } from "react";
import "../styles/clases.css"; // Tu CSS global

export default function Clases() {
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [mostrarUnirse, setMostrarUnirse] = useState(false);
  const [clases, setClases] = useState([]); // Aquí guardamos las clases creadas localmente
  const [mensajeUnirse, setMensajeUnirse] = useState(null);

  const handleMostrarCrear = () => {
    setMostrarCrear(true);
    setMostrarUnirse(false);
    setMensajeUnirse(null);
  };

  const handleMostrarUnirse = () => {
    setMostrarCrear(false);
    setMostrarUnirse(true);
    setMensajeUnirse(null);
  };

  // Función para crear una clase
  const handleCrearClase = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const nuevaClase = {
      materia: formData.get("materia"),
      nombre: formData.get("nombre"),
      seccion: formData.get("seccion"),
      aula: formData.get("aula"),
      creador: formData.get("creador"),
      codigo: Math.random().toString(36).slice(2, 8).toUpperCase(), // Código único random para unirse
    };

    setClases([...clases, nuevaClase]);
    e.target.reset();
    setMensajeUnirse(null);
    alert(`Clase creada con código: ${nuevaClase.codigo}`);
  };

  // Función para unirse a una clase
  const handleUnirseClase = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const materia = formData.get("materia");
    const codigo = formData.get("codigo").toUpperCase();

    // Buscar clase que coincida con materia y código
    const claseEncontrada = clases.find(
      (c) => c.materia.toLowerCase() === materia.toLowerCase() && c.codigo === codigo
    );

    if (claseEncontrada) {
      setMensajeUnirse(`¡Te has unido a la clase "${claseEncontrada.nombre}"!`);
    } else {
      setMensajeUnirse("Clase no encontrada. Verifica materia y código.");
    }

    e.target.reset();
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
            <button id="btnCrearClase" className="btn btn-outline" onClick={handleMostrarCrear}>
              Crear clase
            </button>
            <button id="btnUnirseClase" className="btn btn-primary" onClick={handleMostrarUnirse}>
              Unirse a clase
            </button>
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
            {mensajeUnirse && <p style={{ marginTop: "10px" }}>{mensajeUnirse}</p>}
          </div>
        )}

        {/* Contenedor de tarjetas */}
        <div id="coursesList" style={{ marginTop: "20px" }}>
          {clases.length === 0 ? (
            <p>No hay clases creadas aún.</p>
          ) : (
            clases.map((clase, index) => (
              <div key={index} className="tarjetaClase" style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "6px",
                backgroundColor: "#f9f9f9"
              }}>
                <h3>{clase.nombre}</h3>
                <p><strong>Materia:</strong> {clase.materia}</p>
                <p><strong>Sección:</strong> {clase.seccion}</p>
                <p><strong>Aula:</strong> {clase.aula}</p>
                <p><strong>Profesor:</strong> {clase.creador}</p>
                <p><strong>Código de clase:</strong> {clase.codigo}</p>
              </div>
            ))
          )}
        </div>
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

import React, { useState, useEffect } from "react";
import "../styles/clases.css";

export default function Clases() {
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [mostrarUnirse, setMostrarUnirse] = useState(false);
  const [clases, setClases] = useState([]);

  useEffect(() => {
    const clasesGuardadas = JSON.parse(localStorage.getItem("clases")) || [];
    setClases(clasesGuardadas);
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
              type="button"
              id="btnCrearClase"
              className="btn btn-outline"
              onClick={handleMostrarCrear}
            >
              Crear clase
            </button>
            <button
              type="button"
              id="btnUnirseClase"
              className="btn btn-primary"
              onClick={handleMostrarUnirse}
            >
              Unirse a clase
            </button>
          </div>
        </div>

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

        {mostrarUnirse && (
          <div id="unirseClaseForm">
            <form id="formUnirseClase" onSubmit={handleUnirseClase}>
              <input type="text" name="materia" placeholder="Materia" required />
              <input type="text" name="codigo" placeholder="Código de clase" required />
              <button type="submit">Unirse a clase</button>
            </form>
          </div>
        )}

        <div
          id="coursesList"
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            marginTop: "20px",
          }}
        >
          {clases.map((clase, index) => (
            <div
              key={index}
              className="card"
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "8px",
                width: "200px",
              }}
            >
              <h3>{clase.nombre}</h3>
              <p>
                <strong>Materia:</strong> {clase.materia}
              </p>
              <p>
                <strong>Sección:</strong> {clase.seccion}
              </p>
              <p>
                <strong>Aula:</strong> {clase.aula}
              </p>
              <p>
                <strong>Profesor:</strong> {clase.creador}
              </p>
              <p>
                <strong>Código:</strong> {clase.codigo}
              </p>
            </div>
          ))}
        </div>
      </main>

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

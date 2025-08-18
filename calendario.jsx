import React, { useState, useEffect } from "react";
import "../styles/calendario.css";

// Función de ejemplo para comunicarse con la API
const apiFetch = async (url, options = {}) => {
  try {
    const response = await fetch(`http://localhost:3001/api${url}`, options);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la petición');
    }
    // Si la respuesta no tiene contenido (ej. GET exitoso sin notas)
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } catch (error) {
    console.error('Error en la petición a la API:', error);
    // Devolvemos un objeto de error para poder manejarlo en el componente
    return { error: true, message: error.message };
  }
};


export default function Calendario() {
  const [mes, setMes] = useState(new Date().getMonth());
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [notas, setNotas] = useState([]); // Almacenará las notas de la BD
  
  // Estado para el formulario
  const [textoNota, setTextoNota] = useState("");
  const [diaNota, setDiaNota] = useState("");

  // --- FUNCIÓN PARA OBTENER NOTAS ---
  const fetchNotas = async () => {
    const data = await apiFetch('/calendario/notas');
    if (data && !data.error) {
      setNotas(data);
    }
  };

  // --- USEEFFECT PARA CARGAR NOTAS AL INICIO ---
  useEffect(() => {
    fetchNotas();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

  const cambiarMes = (valor) => {
    let nuevoMes = mes + valor;
    let nuevoAnio = anio;

    if (nuevoMes < 0) {
      nuevoMes = 11;
      nuevoAnio -= 1;
    } else if (nuevoMes > 11) {
      nuevoMes = 0;
      nuevoAnio += 1;
    }

    setMes(nuevoMes);
    setAnio(nuevoAnio);
  };

  // --- FUNCIÓN PARA AGREGAR NOTA (AHORA ASÍNCRONA) ---
  const agregarNota = async (e) => {
    e.preventDefault();
    if (!textoNota || !diaNota) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const fecha_evento = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(diaNota).padStart(2, '0')}`;

    const result = await apiFetch('/calendario/notas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: textoNota,
        descripcion: "", // Puedes añadir un campo de descripción si quieres
        fecha_evento: fecha_evento
      })
    });

    if (result && !result.error) {
      alert(result.message);
      // Limpiar formulario y recargar notas
      setTextoNota("");
      setDiaNota("");
      fetchNotas(); 
    } else {
      alert(result.message || "Error al guardar la nota.");
    }
  };

  const generarCalendario = () => {
    const primerDia = new Date(anio, mes, 1).getDay();
    const diasEnMes = new Date(anio, mes + 1, 0).getDate();
    let calendario = [];
    let diaActual = 1;

    for (let fila = 0; fila < 6; fila++) {
      let semana = [];
      for (let col = 0; col < 7; col++) {
        if ((fila === 0 && col < primerDia) || diaActual > diasEnMes) {
          semana.push({ numero: "", notas: [] });
        } else {
          // Filtrar notas para el día actual
          const notasDelDia = notas.filter(n => {
            // El +1 es porque en JS los meses van de 0-11 y en la BD de 1-12
            const fechaNota = new Date(n.fecha_evento);
            return fechaNota.getUTCDate() === diaActual &&
                   fechaNota.getUTCMonth() === mes &&
                   fechaNota.getUTCFullYear() === anio;
          });
          semana.push({ numero: diaActual, notas: notasDelDia });
          diaActual++;
        }
      }
      calendario.push(semana);
    }
    return calendario;
  };

  const nombreMes = new Intl.DateTimeFormat("es-ES", { month: "long" }).format(
    new Date(anio, mes)
  );

  useEffect(() => {
    document.title = `Calendario - ${nombreMes} ${anio}`;
  }, [nombreMes, anio]);

  return (
    <div>
      <header>
        <div className="logo">
          <img src="/img/logo1.jpg" alt="Logo de la compañía" />
          <a href="/" className="nombre-logo">EDUTECHUB</a>
        </div>
        <nav>
          <a href="/clases.html"><i className="bx bxs-user"></i> Clases</a>
          <a href="/tablon.html"><i className="bx bx-table"></i> Tablón</a>
          <a href="/notas.html"><i className="bx bxs-spreadsheet"></i> Notas</a>
        </nav>
      </header>

      <main className="contenedor">
        <section className="encabezado">
          <button onClick={() => cambiarMes(-1)} aria-label="Mes anterior">←</button>
          <h2>{`${nombreMes} ${anio}`}</h2>
          <button onClick={() => cambiarMes(1)} aria-label="Mes siguiente">→</button>
        </section>

        <form className="formulario-nota" onSubmit={agregarNota}>
          <input
            type="text"
            placeholder="Escribí tu nota..."
            value={textoNota}
            onChange={(e) => setTextoNota(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Día (1-31)"
            min="1"
            max="31"
            value={diaNota}
            onChange={(e) => setDiaNota(e.target.value)}
            required
          />
          <button type="submit">Agregar nota</button>
        </form>

        <table id="calendario">
          <thead>
            <tr>
              <th>Dom</th><th>Lun</th><th>Mar</th><th>Mié</th><th>Jue</th><th>Vie</th><th>Sáb</th>
            </tr>
          </thead>
          <tbody>
            {generarCalendario().map((semana, i) => (
              <tr key={i}>
                {semana.map((dia, j) => (
                  <td key={j}>
                    {dia.numero}
                    <ul>
                      {dia.notas.map((n) => (
                        <li key={n.id}>{n.titulo}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      <footer>
        <p>Derechos de autor © 2024 EdutecHub</p>
      </footer>
    </div>
  );
}

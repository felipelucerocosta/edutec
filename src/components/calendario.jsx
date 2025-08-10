import React, { useState, useEffect } from "react";
import "../styles/calendario.css";
import "boxicons/css/boxicons.min.css";

export default function Calendario() {
  const [mes, setMes] = useState(new Date().getMonth());
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [notas, setNotas] = useState([]);
  const [nota, setNota] = useState("");
  const [dia, setDia] = useState("");
  const [columna, setColumna] = useState("");

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

  const agregarNota = () => {
    setNotas([...notas, { texto: nota, dia, columna }]);
    setNota("");
    setDia("");
    setColumna("");
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
          semana.push("");
        } else {
          semana.push(diaActual);
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

  // ✅ Ahora sí usamos useEffect para actualizar el título de la pestaña
  useEffect(() => {
    document.title = `Calendario - ${nombreMes} ${anio}`;
  }, [nombreMes, anio]);

  return (
    <div>
      <header>
        <div className="logo">
          <img src="../img/logo1.jpg" alt="Logo de la compañía" />
          <a href="/" className="nombre-logo">EDUTECHUB</a>
        </div>

        <nav>
          <a href="/clases.html"><i className="bx bxs-user"></i> Registrarse</a>
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

        <form
          className="formulario-nota"
          onSubmit={(e) => {
            e.preventDefault();
            agregarNota();
          }}
        >
          <input
            type="text"
            placeholder="Escribí tu nota..."
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Día (1-31)"
            min="1"
            max="31"
            value={dia}
            onChange={(e) => setDia(e.target.value)}
            required
          />
          <select
            value={columna}
            onChange={(e) => setColumna(e.target.value)}
            required
          >
            <option value="" disabled>Día de la semana</option>
            <option value="0">Domingo</option>
            <option value="1">Lunes</option>
            <option value="2">Martes</option>
            <option value="3">Miércoles</option>
            <option value="4">Jueves</option>
            <option value="5">Viernes</option>
            <option value="6">Sábado</option>
          </select>
          <button type="submit">Agregar nota</button>
        </form>

        <table id="calendario">
          <thead>
            <tr>
              <th>Dom</th>
              <th>Lun</th>
              <th>Mar</th>
              <th>Mié</th>
              <th>Jue</th>
              <th>Vie</th>
              <th>Sáb</th>
            </tr>
          </thead>
          <tbody>
            {generarCalendario().map((semana, i) => (
              <tr key={i}>
                {semana.map((diaNum, j) => (
                  <td key={j}>
                    {diaNum}
                    <ul>
                      {notas
                        .filter(n => Number(n.dia) === diaNum && Number(n.columna) === j)
                        .map((n, idx) => (
                          <li key={idx}>{n.texto}</li>
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

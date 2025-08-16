
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../styles/calendario.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Calendario() {
  // Lógica para el calendario y notas
  const [navActive, setNavActive] = useState(false);
  const [mes, setMes] = useState(new Date().getMonth());
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [notas, setNotas] = useState({});
  const [nota, setNota] = useState("");
  const [dia, setDia] = useState("");

  useEffect(() => {
    document.title = `EdutecHub`;
  }, []);

  // Funciones para cambiar mes y agregar nota
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
    if (!nota || !dia) return;
    const key = `${anio}-${mes + 1}-${dia}`;
    setNotas((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), nota],
    }));
    setNota("");
    setDia("");
  };

  // Generar calendario
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

  const nombreMes = new Intl.DateTimeFormat("es-ES", { month: "long" }).format(
    new Date(anio, mes)
  );
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

      <div className="cal-pc">
        <div className="contenedor">
          <div className="encabezado">
            <button onClick={() => cambiarMes(-1)}>←</button>
            <h2 id="mes-anio">{nombreMes} {anio}</h2>
            <button onClick={() => cambiarMes(1)}>→</button>
          </div>

          <div className="formulario-nota">
            <input
              type="text"
              id="nota"
              placeholder="Escribí tu nota..."
              value={nota}
              onChange={e => setNota(e.target.value)}
            />
            <input
              type="number"
              id="dia"
              placeholder="Día (1-31)"
              min="1"
              max="31"
              value={dia}
              onChange={e => setDia(e.target.value)}
            />
            <button className="btn" onClick={agregarNota}>Agregar nota</button>
          </div>

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
            <tbody id="cuerpo-calendario">
              {calendario.map((semana, i) => (
                <tr key={i}>
                  {semana.map((diaNum, j) => (
                    <td key={j}>
                      {diaNum}
                      <ul>
                        {(notas[`${anio}-${mes + 1}-${diaNum}`] || []).map((n, idx) => (
                          <li key={idx}>{n}</li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calendario móvil */}
      <div className="cal-mobile">
        <main className="wrap">
          <div className="cal-header">
            <div className="left">
              <div className="month-label" id="mes-anio-mobile">{nombreMes} {anio}</div>
              <div style={{fontSize:'13px',color:'var(--muted)'}}></div>
            </div>
            <div className="controls">
              <button className="btn" onClick={() => cambiarMes(-1)}>◀</button>
              <button className="btn ghost" onClick={() => {setMes(new Date().getMonth());setAnio(new Date().getFullYear());}}>hoy</button>
              <button className="btn" onClick={() => cambiarMes(1)}>▶</button>
            </div>
          </div>
          <div className="days-track" aria-label="Calendario de días">
            {Array.from({ length: diasEnMes }, (_, d) => {
              const diaNum = d + 1;
              const key = `${anio}-${mes + 1}-${diaNum}`;
              return (
                <article key={key} className="day-card" data-key={key}>
                  <div className="day-head">
                    <div className="weekday">
                      {new Date(anio, mes, diaNum).toLocaleString('es-ES', { weekday: 'short' }).replace('.', '')}
                    </div>
                    <div className="daynum">{diaNum}</div>
                  </div>
                  <div className="notes">
                    {(notas[key] || []).map((n, idx) => (
                      <div key={idx} className="note">{n}</div>
                    ))}
                  </div>
                  <button
                    className="btn ghost"
                    style={{ alignSelf: 'stretch', marginTop: '6px' }}
                    onClick={() => {
                      const text = prompt('Nota para ' + key + ':');
                      if (text && text.trim()) {
                        setNotas(prev => ({
                          ...prev,
                          [key]: [...(prev[key] || []), text.trim()]
                        }));
                      }
                    }}
                  >Agregar</button>
                </article>
              );
            })}
          </div>
          <div className="add-form" style={{marginTop:'10px'}}>
            <input
              type="number"
              id="inputDia"
              min="1"
              placeholder="Día"
              value={dia}
              onChange={e => setDia(e.target.value)}
            />
            <input
              type="text"
              id="inputNota"
              placeholder="Escribí tu nota..."
              value={nota}
              onChange={e => setNota(e.target.value)}
            />
            <button className="btn" onClick={agregarNota}>Agregar</button>
          </div>
        </main>
      </div>

      <footer>
        <p>Derechos de autor © 2024 EdutecHub</p>
      </footer>
    </>
  );
}
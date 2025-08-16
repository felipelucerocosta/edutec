//nav
const abrir = document.querySelector("#abrir-nav");
const cerrar = document.querySelector("#cerrar-nav");
const nav = document.querySelector(".nav-bar");

abrir.addEventListener("click", ()=> {
    nav.classList.toggle("active");
});

cerrar.addEventListener("click" , () =>{
    nav.classList.toggle("active")
})
//

const cuerpo = document.getElementById('cuerpo-calendario');
const mesAnio = document.getElementById('mes-anio');
let fecha = new Date();
let celdas = {}; // Mapa para acceder a las celdas por día y columna

function generarCalendario(fechaBase) {
  cuerpo.innerHTML = '';
  celdas = {};

  const año = fechaBase.getFullYear();
  const mes = fechaBase.getMonth();
  const primerDia = new Date(año, mes, 1).getDay();
  const diasMes = new Date(año, mes + 1, 0).getDate();

  mesAnio.textContent = fechaBase.toLocaleString('es-ES', {
    month: 'long',
    year: 'numeric'
  }).toUpperCase();

  let dia = 1;

  while (dia <= diasMes) {
    let fila = document.createElement('tr');

    for (let i = 0; i < 7; i++) {
      let celda = document.createElement('td');

      if (dia === 1 && i < primerDia) {
        // Celdas vacías antes del primer día
        fila.appendChild(celda);
      } else if (dia <= diasMes) {
        // Crear celda con número de día
        celda.innerHTML = `
          <div class="dia-num">${dia}</div>
          <div class="contenido-nota" id="dia-${dia}-${i}"></div>
        `;
        celdas[`${dia}-${i}`] = celda;
        dia++;
        fila.appendChild(celda);
      } else {
        // Celdas vacías después del último día
        fila.appendChild(celda);
      }
    }

    cuerpo.appendChild(fila);
  }
}

generarCalendario(fecha);

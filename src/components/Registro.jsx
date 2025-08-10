import React, { useEffect, useState } from "react";
import "../styles/registro.css";
import "boxicons/css/boxicons.min.css";
export default function Registro() {
  
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const btnIniciarSesion = document.getElementById("btn__iniciar-sesion");
    const btnRegistrarAlumno = document.getElementById("btn__registrarse-alumno");
    const btnRegistrarProfesor = document.getElementById("btn__registrarse-profesor");

    const formulario_login = document.querySelector(".formulario__login");
    const formulario_register_alumno = document.querySelector(".formulario__register-alumno");
    const formulario_register_profesor = document.querySelector(".formulario__register-profesor");
    const contenedor_login_register = document.querySelector(".contenedor__login-register");
    const caja_trasera_login = document.querySelector(".caja__trasera-login");
    const caja_trasera_register = document.querySelector(".caja__trasera-register");

    function anchoPage() {
      if (window.innerWidth > 850) {
        caja_trasera_register.style.display = "block";
        caja_trasera_login.style.display = "block";
      } else {
        caja_trasera_register.style.display = "block";
        caja_trasera_register.style.opacity = "1";
        caja_trasera_login.style.display = "none";
        formulario_login.style.display = "block";
        contenedor_login_register.style.left = "0px";
        formulario_register_alumno.style.display = "none";
        formulario_register_profesor.style.display = "none";
      }
    }

    function iniciarSesion() {
      if (window.innerWidth > 850) {
        formulario_login.style.display = "block";
        contenedor_login_register.style.left = "10px";
        formulario_register_alumno.style.display = "none";
        formulario_register_profesor.style.display = "none";
        caja_trasera_register.style.opacity = "1";
        caja_trasera_login.style.opacity = "0";
      } else {
        formulario_login.style.display = "block";
        contenedor_login_register.style.left = "0px";
        formulario_register_alumno.style.display = "none";
        formulario_register_profesor.style.display = "none";
        caja_trasera_register.style.display = "block";
        caja_trasera_login.style.display = "none";
      }
    }

    function register(tipo) {
      if (window.innerWidth > 850) {
        if (tipo === "alumno") {
          formulario_register_alumno.style.display = "block";
          formulario_register_profesor.style.display = "none";
        } else {
          formulario_register_alumno.style.display = "none";
          formulario_register_profesor.style.display = "block";
        }
        contenedor_login_register.style.left = "410px";
        formulario_login.style.display = "none";
        caja_trasera_register.style.opacity = "0";
        caja_trasera_login.style.opacity = "1";
      } else {
        if (tipo === "alumno") {
          formulario_register_alumno.style.display = "block";
          formulario_register_profesor.style.display = "none";
        } else {
          formulario_register_alumno.style.display = "none";
          formulario_register_profesor.style.display = "block";
        }
        contenedor_login_register.style.left = "0px";
        formulario_login.style.display = "none";
        caja_trasera_register.style.display = "none";
        caja_trasera_login.style.display = "block";
        caja_trasera_login.style.opacity = "1";
      }
    }

    btnIniciarSesion.addEventListener("click", iniciarSesion);
    btnRegistrarAlumno.addEventListener("click", () => register("alumno"));
    btnRegistrarProfesor.addEventListener("click", () => register("profesor"));
    window.addEventListener("resize", anchoPage);

    anchoPage();

    if (window.history.replaceState) {
      window.history.replaceState(null, null, window.location.href);
    }

    return () => {
      btnIniciarSesion.removeEventListener("click", iniciarSesion);
      btnRegistrarAlumno.removeEventListener("click", () => register("alumno"));
      btnRegistrarProfesor.removeEventListener("click", () => register("profesor"));
      window.removeEventListener("resize", anchoPage);
    };
  }, []);

  return (
    <div>
      <header>
        <div className="logo">
          {!logoError ? (
            <img
              src="/img/logo1.jpg"
              alt="Logo"
              onError={() => setLogoError(true)}
              style={{ maxWidth: "150px", height: "auto" }}
            />
          ) : (
            <div
              style={{
                width: "150px",
                height: "80px",
                backgroundColor: "#ddd",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#999",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Logo no disponible
            </div>
          )}
          <a href="index.html" className="nombre-logo">
            EDUTECHUB
          </a>
        </div>
      </header>

      {/* resto del componente sin cambios */}
      <main>
        <div className="contenedor__todo">
          <div className="caja__trasera">
            <div className="caja__trasera-login">
              <h3>¿Ya tienes una cuenta?</h3>
              <p>Inicia sesión para acceder</p>
              <button id="btn__iniciar-sesion">Iniciar Sesión</button>
            </div>

            <div className="caja__trasera-register">
              <h3>¿Aún no tienes cuenta?</h3>
              <p>Regístrate como:</p>
              <button id="btn__registrarse-alumno">Alumno</button>
              <button id="btn__registrarse-profesor">Profesor</button>
            </div>
          </div>

          <div className="contenedor__login-register">
            <form action="#" className="formulario__login">
              <h2>Iniciar Sesión</h2>
              <input type="email" placeholder="Correo electrónico" required />
              <input type="password" placeholder="Contraseña" required />
              <button type="submit">Entrar</button>
            </form>

            <form
              action="http://localhost:3000/registro-alumno"
              method="POST"
              className="formulario__register formulario__register-alumno"
            >
              <h2>Registro Alumno</h2>
              <input
                type="text"
                name="nombre_completo"
                placeholder="Nombre completo"
                required
              />
              <input
                type="email"
                name="correo"
                placeholder="Correo electrónico"
                required
              />
              <input type="text" name="curso" placeholder="Curso" required />
              <input type="text" name="dni" placeholder="DNI" required />
              <input
                type="password"
                name="contrasena"
                placeholder="Contraseña"
                required
              />
              <button type="submit">Registrarse</button>
            </form>

            <form
              action="http://localhost:3000/registro-profesor"
              method="POST"
              className="formulario__register formulario__register-profesor"
            >
              <h2>Registro Profesor</h2>
              <input
                type="text"
                name="nombre_completo"
                placeholder="Nombre completo"
                required
              />
              <input
                type="email"
                name="correo"
                placeholder="Correo electrónico"
                required
              />
              <input type="text" name="materia" placeholder="Materia" required />
              <input type="text" name="dni" placeholder="DNI" required />
              <input
                type="password"
                name="contrasena"
                placeholder="Contraseña"
                required
              />
              <button type="submit">Registrarse</button>
            </form>
          </div>
        </div>
      </main>

      <div className="container_mobile">
        <div className="caja_form">
          <h2>Iniciar sesión</h2>
          <form>
            <div className="caja_input">
              <input type="text" placeholder="Nombre de usuario" required />
              <i className="bx bxs-user"></i>
            </div>
            <div className="caja_input">
              <input type="password" placeholder="Contraseña" required />
              <i className="bx bxs-lock-alt"></i>
            </div>
            <button className="btn">Entrar</button>
            <p>todavía no tienes cuenta</p>
            <a href="#">registrarse</a>
          </form>
        </div>
      </div>
    </div>
  );
}

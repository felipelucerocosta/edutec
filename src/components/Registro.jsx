import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/registro.css";
import "boxicons/css/boxicons.min.css";

export default function Registro() {
  const navigate = useNavigate();
  const [logoError, setLogoError] = useState(false);
  const [usuariosAlumno, setUsuariosAlumno] = useState([]);
  const [usuariosProfesor, setUsuariosProfesor] = useState([]);
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  const [mensajeLogin, setMensajeLogin] = useState(null);
  const [mensajeRegistro, setMensajeRegistro] = useState(null);

  const [tipoFormulario, setTipoFormulario] = useState("login"); // Para mobile

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
      setMensajeLogin(null);
      setMensajeRegistro(null);
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
      setMensajeLogin(null);
      setMensajeRegistro(null);
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

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setMensajeLogin(null);

    const email = e.target[0].value.trim();
    const password = e.target[1].value.trim();

    let usuario = usuariosAlumno.find(
      (u) => u.correo.toLowerCase() === email.toLowerCase() && u.contrasena === password
    );

    let tipoUsuario = "Alumno";

    if (!usuario) {
      usuario = usuariosProfesor.find(
        (u) => u.correo.toLowerCase() === email.toLowerCase() && u.contrasena === password
      );
      tipoUsuario = "Profesor";
    }

    if (usuario) {
      const datosUsuario = { ...usuario, tipo: tipoUsuario };
      setUsuarioLogueado(datosUsuario);
      localStorage.setItem("usuarioLogueado", JSON.stringify(datosUsuario));
      setMensajeLogin(`Bienvenido/a, ${usuario.nombre_completo} (${tipoUsuario})`);
      e.target.reset();
      navigate("/clases");
    } else {
      setMensajeLogin("Usuario o contraseña incorrectos.");
    }
  };

  const handleRegistroAlumno = (e) => {
    e.preventDefault();
    setMensajeRegistro(null);

    const formData = new FormData(e.target);
    const nuevoAlumno = {
      nombre_completo: formData.get("nombre_completo").trim(),
      correo: formData.get("correo").trim(),
      curso: formData.get("curso").trim(),
      dni: formData.get("dni").trim(),
      contrasena: formData.get("contrasena").trim(),
    };

    const existe = usuariosAlumno.some(
      (u) => u.correo.toLowerCase() === nuevoAlumno.correo.toLowerCase()
    );
    if (existe) {
      setMensajeRegistro("El correo ya está registrado como alumno.");
      return;
    }

    setUsuariosAlumno([...usuariosAlumno, nuevoAlumno]);
    setMensajeRegistro("Registro alumno exitoso. Ya podés iniciar sesión.");
    e.target.reset();
    navigate("/clases");
  };

  const handleRegistroProfesor = (e) => {
    e.preventDefault();
    setMensajeRegistro(null);

    const formData = new FormData(e.target);
    const nuevoProfesor = {
      nombre_completo: formData.get("nombre_completo").trim(),
      correo: formData.get("correo").trim(),
      materia: formData.get("materia").trim(),
      dni: formData.get("dni").trim(),
      contrasena: formData.get("contrasena").trim(),
    };

    const existe = usuariosProfesor.some(
      (u) => u.correo.toLowerCase() === nuevoProfesor.correo.toLowerCase()
    );
    if (existe) {
      setMensajeRegistro("El correo ya está registrado como profesor.");
      return;
    }

    setUsuariosProfesor([...usuariosProfesor, nuevoProfesor]);
    setMensajeRegistro("Registro profesor exitoso. Ya podés iniciar sesión.");
    e.target.reset();
    navigate("/clases");
  };
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
          <a href="#" className="nombre-logo">EDUTECHUB</a>
        </div>
      </header>
      <main>
        {/* Versión desktop */}
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
            <form onSubmit={handleLoginSubmit} className="formulario__login" style={{ display: "block" }}>
              <h2>Iniciar Sesión</h2>
              <input type="email" placeholder="Correo electrónico" required />
              <input type="password" placeholder="Contraseña" required />
              <button type="submit">Entrar</button>
              {mensajeLogin && <p style={{ marginTop: "10px" }}>{mensajeLogin}</p>}
              {usuarioLogueado && (
                <p style={{ marginTop: "10px", color: "green" }}>
                  Usuario logueado: {usuarioLogueado.nombre_completo} ({usuarioLogueado.tipo})
                </p>
              )}
            </form>

            <form onSubmit={handleRegistroAlumno} className="formulario__register formulario__register-alumno" style={{ display: "none" }}>
              <h2>Registro Alumno</h2>
              <input type="text" name="nombre_completo" placeholder="Nombre completo" required />
              <input type="email" name="correo" placeholder="Correo electrónico" required />
              <input type="text" name="curso" placeholder="Curso" required />
              <input type="text" name="dni" placeholder="DNI" required />
              <input type="password" name="contrasena" placeholder="Contraseña <i class='bxr  bx-lock'  ></i> " required />
              <button type="submit">Registrarse</button>
              {mensajeRegistro && <p style={{ marginTop: "10px" }}>{mensajeRegistro}</p>}
            </form>

            <form onSubmit={handleRegistroProfesor} className="formulario__register formulario__register-profesor" style={{ display: "none" }}>
              <h2>Registro Profesor</h2>
              <input type="text" name="nombre_completo" placeholder="Nombre completo" required />
              <input type="email" name="correo" placeholder="Correo electrónico" required />
              <input type="text" name="materia" placeholder="Materia" required />
              <input type="text" name="dni" placeholder="DNI" required />
              <input type="password" name="contrasena" placeholder="Contraseña" required />
              <button type="submit">Registrarse</button>
              {mensajeRegistro && <p style={{ marginTop: "10px" }}>{mensajeRegistro}</p>}
            </form>
          </div>
        </div>

        {/* Versión mobile */}
        <div className="container_mobile">
          <div className="flip-card">
            <div
              className="flip-card-inner"
              style={{
                transform:
                  tipoFormulario === "login"
                    ? "rotateY(0deg)"
                    : "rotateY(180deg)",
              }}
            >
              {/* Frente - Login */}
              <div className="flip-card-front mobile-box">
                <h1>Bienvenido</h1>
              

                <form onSubmit={handleLoginSubmit} className="formulario">
                  <h2>Iniciar Sesión</h2>
                  <input type="email" placeholder="Correo electrónico" required />
                  <input type="password" placeholder="Contraseña" required />
                  <button type="submit">Ingresar</button>
                  {mensajeLogin && <p style={{ marginTop: "10px" }}>{mensajeLogin}</p>}
                </form>

                <div className="btn-group">
                  <button onClick={() => setTipoFormulario("alumno")}>Registro Alumno</button>
                  <button onClick={() => setTipoFormulario("profesor")}>Registro Profesor</button>
                </div>
              </div>
              {/* Atrás - Registro */}
              <div className="flip-card-back mobile-box">
                {tipoFormulario === "alumno" && (
                  <form onSubmit={handleRegistroAlumno} className="formulario">
                    <h2>Registro Alumno</h2>
                    <input type="text" name="nombre_completo" placeholder="Nombre completo" required />
                    <input type="email" name="correo" placeholder="Correo electrónico" required />
                    <input type="text" name="curso" placeholder="Curso" required />
                    <input type="text" name="dni" placeholder="DNI" required />
                    <input type="password" name="contrasena" placeholder="Contraseña" required />
                    <button type="submit">Registrarse</button>
                    {mensajeRegistro && <p style={{ marginTop: "10px" }}>{mensajeRegistro}</p>}
                  </form>
                )}

                {tipoFormulario === "profesor" && (
                  <form onSubmit={handleRegistroProfesor} className="formulario">
                    <h2>Registro Profesor</h2>
                    <input type="text" name="nombre_completo" placeholder="Nombre completo" required />
                    <input type="email" name="correo" placeholder="Correo electrónico" required />
                    <input type="text" name="materia" placeholder="Materia" required />
                    <input type="text" name="dni" placeholder="DNI" required />
                    <input type="password" name="contrasena" placeholder="Contraseña" required />
                    <button type="submit">Registrarse</button>
                    {mensajeRegistro && <p style={{ marginTop: "10px" }}>{mensajeRegistro}</p>}
                  </form>
                )}

                <button className="btn-volver-login" id="volver-login" onClick={() => setTipoFormulario("login")}>Volver a Login</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import React, { useState, useEffect } from 'react';

// --- CORRECCIÓN ---
// Se han movido los estilos CSS directamente a este archivo para evitar errores de importación.
const styles = `
  @import url('https://fonts.googleapis.com/css?family=Montserrat:400,800');

* {
  box-sizing: border-box;
}

.login-register-body {
  font-family: 'Montserrat', sans-serif;
  background: #f6f5f7;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.login-register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
}

/* --- NOTIFICACIÓN --- */
.notification {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 15px 25px;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  z-index: 1001;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  min-width: 300px;
}

.notification.success {
  background-color: #4CAF50; /* Verde */
}

.notification.error {
  background-color: #f44336; /* Rojo */
}

/* --- TITULOS Y PÁRRAFOS --- */
h1 {
  font-weight: bold;
  margin: 0;
}

p {
  font-size: 14px;
  font-weight: 100;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
}

/* --- BOTONES --- */
.login-register-container button {
  border-radius: 20px;
  border: 1px solid #9112e6ff;
  background-color: #356ed8ff;
  color: #000000ff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  cursor: pointer;
  margin-top: 10px;
}

.login-register-container button:active {
  transform: scale(0.95);
}

.login-register-container button:focus {
  outline: none;
}

.login-register-container button.ghost {
  background-color: transparent;
  border-color: #000000ff;
}

/* --- FORMULARIOS --- */
.login-register-container form {
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
}

.login-register-container input {
  background-color: #ffffffff;
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
}

/* --- CONTENEDOR PRINCIPAL --- */
.container-principal {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.5), 
              0 10px 10px rgba(0,0,0,0.5);
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 480px;
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
}

.sign-in-container {
  left: 0;
  width: 50%;
  z-index: 2;
}

.sign-up-container {
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
}

/* --- PANEL DESLIZANTE --- */
.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}

.overlay {
  background: -webkit-linear-gradient(to right, #500caaff, #69b6ffff));
  background: linear-gradient(to right, #500caaff, #69b6ffff);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #000000ff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-panel {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-right {
  right: 0;
  transform: translateX(0);
}

.overlay-left {
  transform: translateX(-20%);
}

/* --- EFECTO PANEL ACTIVO --- */
.container-principal.right-panel-active .sign-in-container {
  transform: translateX(100%);
}

.container-principal.right-panel-active .overlay-container {
  transform: translateX(-100%);
}

.container-principal.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  animation: show 0.6s;
}

@keyframes show {
  0%, 49.99% {
    opacity: 0;
    z-index: 1;
  }
  
  50%, 100% {
    opacity: 1;
    z-index: 5;
  }
}

.container-principal.right-panel-active .overlay {
  transform: translateX(50%);
}

.container-principal.right-panel-active .overlay-left {
  transform: translateX(0);
}

.container-principal.right-panel-active .overlay-right {
  transform: translateX(20%);
}

`;

// Función de ejemplo para comunicarse con la API
const apiFetch = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (error) {
    console.error('Error en la petición a la API:', error);
    return { success: false, message: 'Error de conexión con el servidor.' };
  }
};

function Registro() {
  const [view, setView] = useState('login'); // 'login', 'regAlumno', 'regProfesor'
  const [notification, setNotification] = useState({ msg: '', type: '' });
  
  const [loginData, setLoginData] = useState({ correo: '', contrasena: '' });
  const [alumnoData, setAlumnoData] = useState({ nombre_completo: '', correo: '', curso: '', DNI: '', contrasena: '' });
  const [profesorData, setProfesorData] = useState({ nombre_completo: '', correo: '', materia: '', DNI: '', contrasena: '' });

  const showNotification = (msg, type) => {
    setNotification({ msg, type });
    setTimeout(() => {
      setNotification({ msg: '', type: '' });
    }, 4000); // La notificación desaparecerá después de 4 segundos
  };

  const handleInputChange = (e, setter) => {
    setter(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await apiFetch('http://localhost:3001/api/login', loginData);
    showNotification(result.message, result.success ? 'success' : 'error');
    if (result.success) {
      console.log('Login exitoso, rol:', result.usuario.rol);
      // --- CORRECCIÓN AQUÍ ---
      // Se añade un temporizador para redirigir al usuario después de 1.5 segundos.
      setTimeout(() => {
        window.location.href = '/clases.html'; // Redirige a la página de clases
      }, 1500); 
    }
  };

  const handleRegister = async (e, data, type) => {
    e.preventDefault();
    const endpoint = type === 'alumno' ? 'registro-alumno' : 'registro-profesor';
    const result = await apiFetch(`http://localhost:3001/api/${endpoint}`, data);
    const isSuccess = String(result).includes("exitosamente");
    showNotification(result.message || String(result), isSuccess ? 'success' : 'error');
    if (isSuccess) {
      setView('login'); // Volver al login tras registro exitoso
    }
  };

  return (
    <div className="login-register-body">
      <style>{styles}</style>
      <div className="login-register-container">
        {notification.msg && (
          <div className={`notification ${notification.type}`}>
            {notification.msg}
          </div>
        )}
        <div className={`container-principal ${view !== 'login' ? "right-panel-active" : ""}`} id="main">
          
          {/* Contenedor de Formularios de Registro */}
          <div className="form-container sign-up-container">
            {/* Formulario de Registro Alumno */}
            <form onSubmit={(e) => handleRegister(e, alumnoData, 'alumno')} style={{ display: view === 'regAlumno' ? 'flex' : 'none' }}>
              <h1>Crear Cuenta de Alumno</h1>
              <input type="text" name="nombre_completo" placeholder="Nombre Completo" value={alumnoData.nombre_completo} onChange={(e) => handleInputChange(e, setAlumnoData)} required />
              <input type="email" name="correo" placeholder="Correo Electrónico" value={alumnoData.correo} onChange={(e) => handleInputChange(e, setAlumnoData)} required />
              <input type="text" name="curso" placeholder="Curso" value={alumnoData.curso} onChange={(e) => handleInputChange(e, setAlumnoData)} required />
              <input type="text" name="DNI" placeholder="DNI" value={alumnoData.DNI} onChange={(e) => handleInputChange(e, setAlumnoData)} required />
              <input type="password" name="contrasena" placeholder="Contraseña" value={alumnoData.contrasena} onChange={(e) => handleInputChange(e, setAlumnoData)} required />
              <button type="submit">Registrarse</button>
            </form>

            {/* Formulario de Registro Profesor */}
            <form onSubmit={(e) => handleRegister(e, profesorData, 'profesor')} style={{ display: view === 'regProfesor' ? 'flex' : 'none' }}>
              <h1>Crear Cuenta de Profesor</h1>
              <input type="text" name="nombre_completo" placeholder="Nombre Completo" value={profesorData.nombre_completo} onChange={(e) => handleInputChange(e, setProfesorData)} required />
              <input type="email" name="correo" placeholder="Correo Electrónico" value={profesorData.correo} onChange={(e) => handleInputChange(e, setProfesorData)} required />
              <input type="text" name="materia" placeholder="Materia" value={profesorData.materia} onChange={(e) => handleInputChange(e, setProfesorData)} required />
              <input type="text" name="DNI" placeholder="DNI" value={profesorData.DNI} onChange={(e) => handleInputChange(e, setProfesorData)} required />
              <input type="password" name="contrasena" placeholder="Contraseña" value={profesorData.contrasena} onChange={(e) => handleInputChange(e, setProfesorData)} required />
              <button type="submit">Registrarse</button>
            </form>
          </div>

          {/* Formulario de Login */}
          <div className="form-container sign-in-container">
            <form onSubmit={handleLogin}>
              <h1>Iniciar Sesión</h1>
              <input type="email" placeholder="Correo Electrónico" name="correo" value={loginData.correo} onChange={(e) => handleInputChange(e, setLoginData)} required />
              <input type="password" name="contrasena" placeholder="Contraseña" value={loginData.contrasena} onChange={(e) => handleInputChange(e, setLoginData)} required />
              <button type="submit">Entrar</button>
            </form>
          </div>

          {/* Paneles que se mueven */}
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>¡Bienvenido de vuelta!</h1>
                <p>Para mantenerte conectado, por favor inicia sesión con tu información personal</p>
                <button className="ghost" id="signIn" onClick={() => setView('login')}>Iniciar Sesión</button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>¿Aún no tienes cuenta?</h1>
                <p>Elige tu rol para empezar tu viaje con nosotros</p>
                <button className="ghost" id="signUpAlumno" onClick={() => setView('regAlumno')}>Registrarse como Alumno</button>
                <button className="ghost" id="signUpProfesor" onClick={() => setView('regProfesor')}>Registrarse como Profesor</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registro;

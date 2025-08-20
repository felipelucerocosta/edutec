const express = require('express');
const cors = require('cors');
const session = require('express-session');
const apiRutasRouter = require('./api_rutas');

// --- 1. IMPORTAR RUTAS ---
// Primero, importamos todos los archivos de rutas que usaremos.
const mensajesRouter = require('./mensajes');
const registroRouter = require('./registro');
const loginRouter = require('./login'); // Importamos el router de login unificado

// --- 2. INICIALIZAR LA APP ---
// Ahora, creamos la aplicación de Express.
const app = express();
const PORT = process.env.PORT || 3001;

// --- 3. CONFIGURAR MIDDLEWARE ---
// El middleware se configura DESPUÉS de crear la app y ANTES de definir las rutas.
app.use(cors({
  origin: 'http://localhost:5173', // Permitir solo peticiones del frontend de Vite
  credentials: true // Necesario para que las cookies de sesión funcionen
}));
app.use(express.json()); // Para parsear body tipo JSON
app.use(express.urlencoded({ extended: true })); // Para parsear body tipo form

// Middleware de Sesión
// La clave secreta debería ser más segura y venir de una variable de entorno
app.use(session({
  secret: 'una-clave-muy-secreta-y-larga',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // En producción, usar cookies seguras (HTTPS)
    httpOnly: true, // Previene acceso a la cookie desde JS en el cliente
    sameSite: 'lax' // Protección contra CSRF
  }
}));

// --- 4. USAR LAS RUTAS DE LA API ---
// Finalmente, le decimos a la app que use los routers que importamos.
app.use('/api', mensajesRouter);
app.use('/api', registroRouter);
app.use('/api', loginRouter); // Usamos el router de login que importamos arriba
// Justo debajo de las otras rutas (app.use(...))
app.use('/api', apiRutasRouter);
// Ruta de prueba para la raíz del servidor
app.get('/', (req, res) => {
  res.send('Servidor del Backend de EduTecHub funcionando!');
});

// --- 5. INICIAR EL SERVIDOR ---
// El último paso es poner al servidor a escuchar peticiones.
app.listen(PORT, () => {
  console.log(`✅ Servidor del Backend corriendo en http://localhost:${PORT}`);
});

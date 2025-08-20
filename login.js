const express = require('express');
const router = express.Router();
const pool = require('./conexion_be'); // Usar el mismo pool de conexión que en registro.js
const bcrypt = require('bcrypt');     // Usar la misma librería de encriptación

// Ruta POST para un login unificado (sirve para alumnos y profesores)
router.post('/login', async (req, res) => {
  // Limpiamos los espacios en blanco del correo y la contraseña que vienen del formulario.
  const correo = req.body.correo ? req.body.correo.trim() : '';
  const contrasena = req.body.contrasena ? req.body.contrasena.trim() : '';

  // Verificación inicial de que los datos no vienen vacíos
  if (!correo || !contrasena) {
    return res.status(400).json({ success: false, message: 'Faltan correo o contraseña.' });
  }

  try {
    // 1. Buscar al usuario en la tabla principal 'usuarios' por su correo.
    const userQuery = 'SELECT * FROM usuarios WHERE correo = $1';
    const { rows } = await pool.query(userQuery, [correo]);

    // Si el array 'rows' está vacío, el correo no existe.
    if (rows.length === 0) {
      console.log(`Intento de login fallido: No se encontró el usuario con correo ${correo}`);
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas.' });
    }

    const usuario = rows[0];
    console.log(`Usuario encontrado:`, usuario.correo);

    // 2. Comparar la contraseña ingresada con el hash guardado en la base de datos.
    const passwordMatch = await bcrypt.compare(contrasena, usuario.contrasena.trim());
    console.log(`Resultado de la comparación de contraseña: ${passwordMatch}`);

    // Si la comparación devuelve 'false', las contraseñas no coinciden.
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas.' });
    }

    // --- SI LLEGAMOS AQUÍ, EL LOGIN ES EXITOSO ---
    console.log(`¡Login exitoso para el usuario ${correo}!`);

    // 3. Determinar el rol del usuario.
    let rol = 'alumno';
    // --- CORRECCIÓN AQUÍ ---
    // Cambiamos "ID_Usuario" a "id_usuario" (en minúsculas) para que coincida con el nombre de la columna en la base de datos.
    const profesorQuery = 'SELECT * FROM profesor WHERE id_usuario = $1';
    const profesorResult = await pool.query(profesorQuery, [usuario.id_usuario]);

    if (profesorResult.rows.length > 0) {
      rol = 'profesor';
    }
    console.log(`Rol asignado: ${rol}`);

    // 4. Guardar datos en la sesión.
    req.session.usuario = {
      id: usuario.id_usuario,
      nombre: usuario.nombre_completo,
      correo: usuario.correo,
      rol: rol
    };

    // 5. Enviar respuesta exitosa al frontend.
    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso.',
      usuario: req.session.usuario
    });

  } catch (err) {
    console.error('Error en la consulta de login:', err);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
});

module.exports = router;
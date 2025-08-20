const express = require('express');
const router = express.Router();
const pool = require('./conexion_be');
const multer = require('multer');

// --- Configuración de Multer para la subida de archivos ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Asegúrate de crear una carpeta llamada 'uploads' en tu directorio Backend
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// ======================================================
// 1. CALENDARIO
// ======================================================

// --- RUTA AÑADIDA ---
// Obtener todas las notas del calendario para el usuario que ha iniciado sesión
router.get('/calendario/notas', async (req, res) => {
  const id_usuario = req.session.usuario ? req.session.usuario.id : null;

  if (!id_usuario) {
    return res.status(401).json({ message: 'No autorizado.' });
  }

  try {
    const query = `SELECT * FROM calendario_notas WHERE id_usuario = $1;`;
    const { rows } = await pool.query(query, [id_usuario]);
    res.status(200).json(rows); // Devuelve la lista de notas
  } catch (err) {
    console.error('Error al obtener notas del calendario:', err);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});


router.post('/calendario/notas', async (req, res) => {
  const id_usuario = req.session.usuario ? req.session.usuario.id : null;
  const { titulo, descripcion, fecha_evento } = req.body;

  if (!id_usuario) {
    return res.status(401).json({ message: 'No autorizado. Por favor, inicie sesión.' });
  }
  if (!titulo || !fecha_evento) {
    return res.status(400).json({ message: 'El título y la fecha son obligatorios.' });
  }

  try {
    const query = `
      INSERT INTO calendario_notas (id_usuario, titulo, descripcion, fecha_evento)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const { rows } = await pool.query(query, [id_usuario, titulo, descripcion, fecha_evento]);
    res.status(201).json({ message: 'Nota del calendario guardada exitosamente.', nota: rows[0] });
  } catch (err) {
    console.error('Error al guardar nota del calendario:', err);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// ======================================================
// 2. NOTAS DEL PROFESOR
// ======================================================
router.post('/profesor/notas', async (req, res) => {
  const id_profesor = req.session.usuario ? req.session.usuario.id : null;
  const { titulo, contenido } = req.body;

  if (!id_profesor || req.session.usuario.rol !== 'profesor') {
    return res.status(403).json({ message: 'Acción no permitida.' });
  }

  try {
    const query = `
      INSERT INTO notas_profesor (id_profesor, titulo, contenido)
      VALUES ($1, $2, $3) RETURNING *;
    `;
    const { rows } = await pool.query(query, [id_profesor, titulo, contenido]);
    res.status(201).json({ message: 'Nota subida exitosamente.', nota: rows[0] });
  } catch (err) {
    console.error('Error al subir nota del profesor:', err);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});


// ======================================================
// 3. TRABAJOS Y MATERIALES DEL PROFESOR
// ======================================================

// Ruta para subir materiales (archivos)
router.post('/profesor/materiales', upload.single('archivo'), async (req, res) => {
  const id_profesor = req.session.usuario ? req.session.usuario.id : null;
  const { titulo, descripcion } = req.body;
  const ruta_archivo = req.file ? req.file.path : null;

  if (!id_profesor || req.session.usuario.rol !== 'profesor') {
    return res.status(403).json({ message: 'Acción no permitida.' });
  }
  if (!ruta_archivo) {
    return res.status(400).json({ message: 'No se ha subido ningún archivo.' });
  }

  try {
    const query = `
      INSERT INTO materiales (id_profesor, titulo, descripcion, ruta_archivo)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const { rows } = await pool.query(query, [id_profesor, titulo, descripcion, ruta_archivo]);
    res.status(201).json({ message: 'Material subido exitosamente.', material: rows[0] });
  } catch (err) {
    console.error('Error al subir material:', err);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Ruta para crear un trabajo (asignación)
router.post('/profesor/trabajos', async (req, res) => {
    const id_profesor = req.session.usuario ? req.session.usuario.id : null;
    const { titulo, descripcion, fecha_entrega } = req.body;

    if (!id_profesor || req.session.usuario.rol !== 'profesor') {
        return res.status(403).json({ message: 'Acción no permitida.' });
    }

    try {
        const query = `
            INSERT INTO trabajos (id_profesor, titulo, descripcion, fecha_entrega)
            VALUES ($1, $2, $3, $4) RETURNING *;
        `;
        const { rows } = await pool.query(query, [id_profesor, titulo, descripcion, fecha_entrega]);
        res.status(201).json({ message: 'Trabajo creado exitosamente.', trabajo: rows[0] });
    } catch (err) {
        console.error('Error al crear trabajo:', err);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});


// ======================================================
// 4. CALIFICACIÓN DE TRABAJOS
// ======================================================
router.put('/trabajos/calificar/:id_entrega', async (req, res) => {
  const id_profesor = req.session.usuario ? req.session.usuario.id : null;
  const { id_entrega } = req.params;
  const { calificacion, comentario_profesor } = req.body;

  if (!id_profesor || req.session.usuario.rol !== 'profesor') {
    return res.status(403).json({ message: 'Acción no permitida.' });
  }
  if (calificacion === undefined) {
    return res.status(400).json({ message: 'La calificación es obligatoria.' });
  }

  try {
    const query = `
      UPDATE entregas
      SET calificacion = $1, comentario_profesor = $2
      WHERE id = $3
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [calificacion, comentario_profesor, id_entrega]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No se encontró la entrega especificada.' });
    }

    res.status(200).json({ message: 'Trabajo calificado exitosamente.', entrega: rows[0] });
  } catch (err) {
    console.error('Error al calificar trabajo:', err);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});


module.exports = router;
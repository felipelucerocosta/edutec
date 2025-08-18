const express = require('express');
const app = express();
const cors = require('cors');
const registroRouter = require('./registro'); // nombre del archivo

app.use(cors()); // opcional si estás probando desde navegador
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('HTML')); // Sirve tus archivos HTML desde la carpeta HTML

app.use('/', registroRouter);

// Eliminadas las rutas duplicadas para registro-alumno y registro-profesor

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});

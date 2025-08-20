import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa tus componentes de página
// --- CORRECCIÓN AQUÍ ---
// Se ha corregido la capitalización en los nombres de archivo para que coincida con la convención estándar de React.
import Registro from './components/Registro.jsx'; 
import Clases from './components/Clases.jsx';     
import Calendario from './components/Calendario.jsx'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* La ruta principal "/" ahora mostrará el componente de Registro/Login */}
        <Route path="/" element={<Registro />} />

        {/* Define las rutas para tus otras páginas */}
        <Route path="/clases" element={<Clases />} />
        <Route path="/calendario" element={<Calendario />} />
        
        {/* Puedes añadir más rutas aquí en el futuro */}
      </Routes>
    </Router>
  );
}

export default App;

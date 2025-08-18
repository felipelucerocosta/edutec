import React from 'react';
import ReactDOM from 'react-dom/client';
// --- CORRECCIÓN AQUÍ ---
// Se ha cambiado la ruta a una ruta absoluta desde la raíz del proyecto para asegurar que Vite encuentre el archivo.
import App from '/src/App.jsx'; 

// Renderiza el componente App, que contiene toda la lógica de ruteo
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

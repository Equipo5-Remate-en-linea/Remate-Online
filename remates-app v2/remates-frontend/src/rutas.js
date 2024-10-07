import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Inicio from './Inicio';
import ProductoDetalle from './ProductoDetalle'; // Importar el componente de detalles del producto

function Rutas() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} /> {/* Nueva ruta para detalles del producto */}
      </Routes>
    </Router>
  );
}

export default Rutas;

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Inicio from "./pages/Inicio";
import CuentasAdministrador from "./pages/cuentas_administrador";
// import Home from './Home';
import NavbarCustom from "./components/navbar";
import ProductoDetalle from "./pages/ProductoDetalle";
import Administracion from "./pages/Administracion";

function Rutas() {
  return (
    <Router>
      <NavbarCustom />
      <Routes>
        <Route path="/" element={<Inicio />} />
        {/* Nueva ruta para detalles del producto */}
        <Route path="/producto/:id" element={<ProductoDetalle />} />
        <Route path="/administracion" element={<Administracion />} />
        <Route
          path="/cuentas_administrador"
          element={<CuentasAdministrador />}
        />
      </Routes>
    </Router>
  );
}

export default Rutas;

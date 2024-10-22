import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Inicio from "./pages/Inicio";
// import Home from './Home';
import NavbarCustom from "./components/navbar";
import ProductoDetalle from "./pages/ProductoDetalle";
import AdministracionProductos from "./pages/AdministracionProductos";
import AdministracionCuentas from "./pages/AdministracionCuentas";
import AdministracionProductosDetalle from "./pages/AdministracionProductosDetalle";
import AgregarProducto from "./pages/AgregarProducto";
import EditarProducto from "./pages/EditarProducto";

function Rutas() {
  return (
    <Router>
      <NavbarCustom />
      <Routes>
        <Route path="/" element={<Inicio />} />
        {/* Nueva ruta para detalles del producto */}
        <Route path="/producto/:id" element={<ProductoDetalle />} />
        <Route
          path="/administracion/productos"
          element={<AdministracionProductos />}
        />
        <Route
          path="/administracion/productos/agregar"
          element={<AgregarProducto />}
        />
        <Route
          path="/administracion/productos/:id"
          element={<AdministracionProductosDetalle />}
        />
        <Route
          path="/administracion/productos/editar/:id"
          element={<EditarProducto />}
        />
        <Route
          path="/administracion/cuentas"
          element={<AdministracionCuentas />}
        />
      </Routes>
    </Router>
  );
}

export default Rutas;

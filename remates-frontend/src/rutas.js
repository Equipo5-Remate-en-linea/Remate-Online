import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Inicio from './Inicio'
import CuentasAdministradro from './administracion/cuentas_administrador'
// import Home from './Home';
import NavbarCustom from './navbar';


function Rutas() {
  return (
    <Router>
      <NavbarCustom />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/cuentas_administrador" element={<CuentasAdministradro />} />
      </Routes>
    </Router>
  );
}

export default Rutas;
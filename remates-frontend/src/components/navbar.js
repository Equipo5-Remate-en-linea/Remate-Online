// import { useEffect, useState } from 'react';
import "../assets/navbar.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useState } from "react";
import InicioSesion from "./inicio_sesion";
import Registrarse from "./registro";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import endpoints from "../api/endpoints";

function NavbarCustom() {
  const [estadoinicio, setEstadoInicio] = useState(false);
  const [InicioExitoso, setInicioExitoso] = useState(false);
  const [estadoregistro, setEstadoRegistro] = useState(false);
  const [usuarioAdministrador, setusuarioAdministrador] = useState(false);

  const AbrirInicio = () => setEstadoInicio(true);
  const AbrirRegistro = () => setEstadoRegistro(true);

  const navigate = useNavigate();

  const PaginaAdministracionProductos = () => {
    navigate("/administracion/productos");
  };

  const PaginaAdministracionCuentas = () => {
    navigate("/administracion/cuentas");
  };

  const PaginaAdministracionLogs = () => {
    navigate("/administracion/logs");
  };

  useEffect(() => {
    console.log(getCookieValue("token"));
    if (getCookieValue("token") !== null) {
      setInicioExitoso(true);
    } else {
      setInicioExitoso(false);
    }
    console.log("El componente se ha cargado");

    // Si necesitas ejecutar algo al desmontar el componente, puedes devolver una función:
    return () => {
      console.log("El componente se está desmontando");
    };
  }, []);

  // const getCookie = (name) => {
  //   console.log(`${document.cookie}`);
  //   const value = `; ${document.cookie}`;
  //   const parts = value.split(`; ${name}=`);
  //   if (parts.length === 2) return parts.pop().split(";").shift();
  //   return null;
  // };

  const getCookieValue = (name) => {
    // Obtener todas las cookies
    const cookies = document.cookie.split("; ");
    // Buscar la cookie específica
    for (let cookie of cookies) {
      // Separar el nombre y el valor
      const [key, value] = cookie.split("=");
      // Si encontramos la cookie, devolvemos el valor (incluyendo 'null' como string)
      if (key === name) {
        if (value === "null") {
          return null;
        } else {
          return true;
        }
      }
    }
    return null; // Devolver null si no se encuentra la cookie
  };

  const BorrarCookie = () => {
    document.cookie = "token=; path=/; max-age=0; SameSite=Strict";
    localStorage.clear();
    setInicioExitoso(false);
  };

  if (InicioExitoso === true) {
    verificarUsuarioAdministrador();
  }

  async function verificarUsuarioAdministrador() {
    try {
      const response = await fetch(endpoints.usuarioAdmin, {
        method: "GET",
        credentials: "include", // Incluye las cookies en la solicitud
      });

      if (!response.ok) {
        throw new Error("Error al obtener datos del usuario");
      }

      const data = await response.text(); // O usa .json() si devuelves un objeto JSON
      setusuarioAdministrador(data); // Muestra la respuesta en la consola
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <Navbar
      expand="lg"
      className="color-navbar tamano-navbar style-navbar margen-navbar"
    >
      <Container>
        <Navbar.Brand className="color-letra" href="/">
          El Rincón del Olvido
        </Navbar.Brand>
        <Navbar.Toggle
          id="Menu_hamburguesa"
          aria-controls="basic-navbar-nav"
          className="color-toggle"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link className="color-letra" href="/">
              Inicio
            </Nav.Link>
          </Nav>
          <div className="justify-content-end ">
            {InicioExitoso ? (
              <Nav className="me-auto">
                {usuarioAdministrador && (
                  <Nav.Link
                    id="Administrar_productos"
                    className="color-letra linea-bajo-texto"
                    onClick={PaginaAdministracionProductos}
                  >
                    Productos
                  </Nav.Link>
                )}
                {usuarioAdministrador && (
                  <Nav.Link
                    id="Administrar_cuentas"
                    className="color-letra linea-bajo-texto"
                    onClick={PaginaAdministracionCuentas}
                  >
                    Cuentas
                  </Nav.Link>
                )}
                {usuarioAdministrador && (
                  <Nav.Link
                    id="logs"
                    className="color-letra linea-bajo-texto"
                    onClick={PaginaAdministracionLogs}
                  >
                    Logs
                  </Nav.Link>
                )}
                <Nav.Link
                  className="color-letra linea-bajo-texto"
                  onClick={BorrarCookie}
                >
                  Cerrar sesion
                </Nav.Link>
              </Nav>
            ) : (
              <Nav className="me-auto">
                <Nav.Link
                  id="Inicio_sesion"
                  className="color-letra linea-bajo-texto"
                  onClick={AbrirInicio}
                >
                  Inicio sesion
                </Nav.Link>
                <Nav.Link
                  id="Registro"
                  className="color-letra linea-bajo-texto"
                  onClick={AbrirRegistro}
                >
                  Registrarse
                </Nav.Link>
              </Nav>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
      <InicioSesion
        estado={estadoinicio}
        setEstado={setEstadoInicio}
        setInicioExitoso={setInicioExitoso}
      />
      <Registrarse estado={estadoregistro} setEstado={setEstadoRegistro} />
    </Navbar>
  );
}

export default NavbarCustom;

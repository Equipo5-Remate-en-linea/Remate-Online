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

  const PaginaAdministracion = () => {
    navigate("/administracion");
  };

  useEffect(() => {
    if (getCookie("token") !== null) {
      setInicioExitoso(true);
    }
    console.log("El componente se ha cargado");

    // Si necesitas ejecutar algo al desmontar el componente, puedes devolver una función:
    return () => {
      console.log("El componente se está desmontando");
    };
  }, []);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const BorrarCookie = () => {
    document.cookie = "token=; path=/; max-age=0; SameSite=Strict";
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
                    className="color-letra linea-bajo-texto"
                    onClick={PaginaAdministracion}
                  >
                    Administracion
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
                  className="color-letra linea-bajo-texto"
                  onClick={AbrirInicio}
                >
                  Inicio sesion
                </Nav.Link>
                <Nav.Link
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

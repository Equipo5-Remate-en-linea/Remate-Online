import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import endpoints from "../api/endpoints";
import "../assets/inicio_sesion.css";

function InicioSesion({ estado, setEstado, setInicioExitoso }) {
  const Cerrar = () => setEstado(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const ActualizarContrasena = (event) => {
    setPassword(event.target.value); // Actualiza el estado cuando cambia el valor
  };

  const ActualizarEmail = (event) => {
    setEmail(event.target.value); // Actualiza el estado cuando cambia el valor
  };

  const iniciar_sesion = async (event) => {
    event.preventDefault();

    const Usuario = {
      email: email,
      contrasena: password,
    };

    // Hacer la solicitud POST al backend
    fetch(endpoints.login, {
      method: "POST", // Método POST para crear
      headers: {
        "Content-Type": "application/json", // Indicar que se envían datos JSON
      },
      body: JSON.stringify(Usuario), // Convertir los datos a JSON para enviarlos
    })
      .then((response) => response.json())
      .then((data) => {
        if (
          data["problema"] === "Usuario" ||
          data["problema"] === "Contrasena"
        ) {
          setError("Correo o contraseña invalida");
        } else {
          document.cookie = `token=${data["token"]}; path=/; max-age=3600`;
          setError("");
          Cerrar();
          setInicioExitoso(true);
        }
      })
      .catch((error) => {
        console.error("Error al validar usuario:", error);
      });
  };

  return (
    <>
      <Modal show={estado} onHide={Cerrar}>
        <Modal.Header closeButton>
          <Modal.Title>Iniciar Sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={iniciar_sesion}>
            <Form.Group className="mb-3">
              <Form.Label>Dirección de correo</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={ActualizarEmail}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="inputPassword5">Password</Form.Label>
              <Form.Control
                type="password"
                aria-describedby="passwordHelpBlock"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={ActualizarContrasena}
                required
              />
              {error && <p style={{ color: "red" }}>{error}</p>}
            </Form.Group>
            <Modal.Footer>
              <Button variant="primary" className="color-boton" type="submit">
                Iniciar sesión
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default InicioSesion;

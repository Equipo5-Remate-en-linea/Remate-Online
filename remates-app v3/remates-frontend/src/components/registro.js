import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import endpoints from "../api/endpoints";

function Registrarse({ estado, setEstado }) {
  const Cerrar = () => setEstado(false);
  const Cerrar_estado = () => {
    setestadoCuenta(false);
    setestadoCuentaTextoTitulo("");
    setestadoCuentaTextoCuerpo("");
    setDireccion("");
    setEmail("");
    setPassword("");
    setTrypassword("");
  };

  const [direccion, setDireccion] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [trypassword, setTrypassword] = useState("");
  const [estadoCuentaTextoTitulo, setestadoCuentaTextoTitulo] = useState("");
  const [estadoCuentaTextoCuerpo, setestadoCuentaTextoCuerpo] = useState("");
  const [estadoCuenta, setestadoCuenta] = useState(false);
  const [errorContrasena, setErrorContrasena] = useState(false);

  const ActualizarDireccion = (event) => {
    setDireccion(event.target.value); // Actualiza el estado cuando cambia el valor
  };

  const ActualizarEmail = (event) => {
    setEmail(event.target.value); // Actualiza el estado cuando cambia el valor
  };

  const ActualizarContrasena = (event) => {
    setPassword(event.target.value); // Actualiza el estado cuando cambia el valor
  };

  const ActualizarTryContrasena = (event) => {
    setTrypassword(event.target.value); // Actualiza el estado cuando cambia el valor
    if (event.target.value !== password) {
      setErrorContrasena(false);
    } else {
      setErrorContrasena(true);
    }
  };

  const crearUsuario = async (event) => {
    event.preventDefault();

    if (password === trypassword && password !== "") {
      const nuevoUsuario = {
        direccion_envio: direccion,
        email: email,
        contrasena: password,
        administrador: false,
      };

      // Hacer la solicitud POST al backend
      fetch(endpoints.usuarios, {
        method: "POST", // Método POST para crear
        headers: {
          "Content-Type": "application/json", // Indicar que se envían datos JSON
        },
        body: JSON.stringify(nuevoUsuario), // Convertir los datos a JSON para enviarlos
      })
        .then((response) => response.json())
        .then((data) => {
          Cerrar();
          setestadoCuenta(true);
          setestadoCuentaTextoTitulo("Cuenta creada con exito");
          setestadoCuentaTextoCuerpo(
            "Se envio correo de confirmación, valide para poder ingresar"
          );
        })
        .catch((error) => {
          setestadoCuentaTextoTitulo("Fallo al crear la cuenta");
          setestadoCuentaTextoCuerpo(
            "Contacte con un administrador, fallo en el servidor"
          );
          console.error("Error al crear el usuario:", error);
        });
    }
  };

  return (
    <>
      <Modal show={estado} onHide={Cerrar}>
        <Modal.Header closeButton>
          <Modal.Title>Registrate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={crearUsuario}>
            <Form.Group className="mb-3">
              <Form.Label>Dirección de envio</Form.Label>
              <Form.Control
                type="text"
                placeholder="Pasaje 123, Comuna"
                value={direccion}
                onChange={ActualizarDireccion}
                pattern="^[A-Za-záéíóúñÁÉÍÓÚÑ ]+ \d+, [A-Za-záéíóúñÁÉÍÓÚÑ ]+$"
                title="Siga el ejemplo: Pasaje 123, Comuna"
                required
              />
            </Form.Group>
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
              <Form.Label htmlFor="inputPassword5">Contraseña</Form.Label>
              <Form.Control
                type="password"
                aria-describedby="passwordHelpBlock"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={ActualizarContrasena}
                required
                pattern=".{6,}"
                title="La contraseña debe tener al menos 6 caracteres"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="inputPassword5">
                Confirme Contraseña
              </Form.Label>
              <Form.Control
                type="password"
                aria-describedby="passwordHelpBlock"
                placeholder="Ingrese su contraseña"
                value={trypassword}
                onChange={ActualizarTryContrasena}
                pattern={!errorContrasena ? "" : ".*"}
                title={errorContrasena ? "" : "Las contraseñas no coinciden"}
                required
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="primary" className="color-boton" type="submit">
                Registrarse
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={estadoCuenta} onHide={Cerrar_estado}>
        <Modal.Header closeButton>
          <Modal.Title>{estadoCuentaTextoTitulo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {estadoCuentaTextoCuerpo}
          <div style={{ height: "20px" }}></div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Registrarse;

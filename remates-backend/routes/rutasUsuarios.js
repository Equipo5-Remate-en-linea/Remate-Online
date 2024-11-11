// librerias
const express = require("express");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
// modulos
const Usuario = require("../models/Usuarios");
const Log = require("../models/Log");
const authenticateToken = require("../middleware/authenticateToken");
const { addLog } = require("../helpers");

const router = express.Router();

// Configuración del transporte
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "r1nc0nd3l0lv1d0@gmail.com", // Tu correo electrónico
    pass: "urno wlrt mieh hqif", // Tu contraseña o un App Password si tienes 2FA activado
  },
});

function generarMensajeRegistroMisterioso() {
  return `
  Estimado/a,

  Hemos recibido tu solicitud. A partir de este momento, formas parte de un círculo muy selecto.

  La puerta está abierta. Lo que sucede a partir de ahora depende de ti. Sé discreto/a, y recuerda que las oportunidades que se presentan aquí no están al alcance de todos. 

  Mantente atento/a. Los que saben mirar, encuentran lo que buscan.

  No respondas a este mensaje.

  El equipo.
  `;
}
function obtenerMail(email) {
  const msg_registro = generarMensajeRegistroMisterioso();
  return {
    from: "r1nc0nd3l0lv1d0@gmail.com",
    to: email,
    subject: "Notificación Registro de Cuenta",
    text: msg_registro,
  };
}

// Función para enviar correo
function enviarCorreo(email) {
  let mail = obtenerMail(email);

  transporter.sendMail(mail, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Correo enviado: " + info.response);
    }
  });
}

// Crear usuario
const crearUsuario = async (req, res) => {
  const { direccion_envio, email, contrasena, administrador } = req.body;

  const salt = await bcrypt.genSalt(10); // Genera un "salt"
  const contrasenaEncriptada = await bcrypt.hash(contrasena, salt);

  const nuevoUsuario = new Usuario({
    direccion_envio,
    email,
    contrasena: contrasenaEncriptada,
    administrador: false,
  });
  enviarCorreo(email);
  await nuevoUsuario.save();
  res.status(201).send(nuevoUsuario);
  addLog(`Nuevo usuario registrado con el email: ${email}.`);
};

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find(); // Busca todos los usuarios
    res.json(usuarios); // Devuelve los usuarios en formato JSON
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios", error });
  }
};

// Obtiene si un usuario es amdin o no
const esAdmin = async (req, res) => {
  try {
    // Buscar el usuario en la base de datos usando su email
    const usuario = await Usuario.findOne({ email: req.user.email });

    if (!usuario) {
      return res.status(404).send("Usuario no encontrado");
    }

    return res.send(usuario.administrador);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error en el servidor");
  }
};

// Actualizar usuario
const actualizarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    // Busca el usuario por su ID
    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Intercambiar el estado de administrador
    usuario.administrador = !usuario.administrador;

    // Guarda los cambios en la base de datos
    await usuario.save();

    const descripcion = `Se ha ${
      usuario.administrador ? "asignado" : "quitado"
    } el rol de administrador al usuario con email: ${usuario.email}.`;
    addLog(descripcion);

    // res.json(usuarioActualizado); // Devuelve el usuario actualizado
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Eliminar usuario
const eliminarUsuario = async (req, res) => {
  await Usuario.findByIdAndDelete(req.params.id);
  res.status(204).send();
};

router.post("/", crearUsuario);
router.get("/", authenticateToken, obtenerUsuarios);
router.get("/admin", authenticateToken, esAdmin);
router.put("/:id", authenticateToken, actualizarUsuario);
router.delete("/:id", eliminarUsuario);

module.exports = router;

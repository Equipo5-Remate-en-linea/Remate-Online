const express = require("express");
const bcrypt = require('bcryptjs');

const router = express.Router();

const Usuario = require("../models/Usuarios");
const authenticateToken = require("../middleware/authenticateToken");

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
  await nuevoUsuario.save();
  res.status(201).send(nuevoUsuario);
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
